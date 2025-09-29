import sharp from "sharp";

export type ConvertedImage = {
  buffer: Buffer;
  mimeType: string;
  filename: string;
  width: number;
  height: number;
};

export async function convertToModernImage(
  inputBuffer: Buffer,
  originalName: string,
  prefer: "webp" | "avif" = "webp",
  options?: {
    maxWidth?: number; // resize cap
    maxHeight?: number; // resize cap
    quality?: number; // 1-100
    effort?: number; // 0-9 (cpu effort/encode time)
  }
): Promise<ConvertedImage> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 80,
    effort = 4, // balanced default
  } = options ?? {};

  // Inspect metadata
  const meta = await sharp(inputBuffer).metadata();
  if (!meta.width || !meta.height) {
    throw new Error("Could not extract image dimensions");
  }

  let buffer = inputBuffer;
  let mimeType = `image/${meta.format}`;
  let filename = originalName;

  // Already a modern format → return as-is
  if (meta.format === "webp" || meta.format === "avif") {
    return {
      buffer,
      mimeType,
      filename,
      width: meta.width,
      height: meta.height,
    };
  }

  // Build Sharp pipeline with resize
  const pipeline = sharp(inputBuffer).resize({
    width: maxWidth,
    height: maxHeight,
    fit: "inside",
    withoutEnlargement: true,
  });

  if (prefer === "avif") {
    buffer = await pipeline
      .avif({
        quality,
        effort, // 0 (fastest) → 9 (slowest, smallest)
      })
      .toBuffer();

    mimeType = "image/avif";
    filename =
      changeExtension(originalName, ".avif") ?? `${originalName}.avif`;
  } else {
    buffer = await pipeline
      .webp({
        quality,
        effort, // 0 (fastest) → 6 (slowest)
      })
      .toBuffer();

    mimeType = "image/webp";
    filename =
      changeExtension(originalName, ".webp") ?? `${originalName}.webp`;
  }

  // Extract final metadata (after resize)
  const finalMeta = await sharp(buffer).metadata();

  return {
    buffer,
    mimeType,
    filename,
    width: finalMeta.width ?? meta.width,
    height: finalMeta.height ?? meta.height,
  };
}

// Helper to replace extension
function changeExtension(filename: string, newExt: string): string | null {
  const dot = filename.lastIndexOf(".");
  if (dot === -1) return null;
  return filename.slice(0, dot) + newExt;
}