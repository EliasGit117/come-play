import sharp from 'sharp';
import { rgbaToThumbHash } from 'thumbhash';

export async function createThumbhashFromFile(file: File): Promise<Uint8Array> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const metadata = await sharp(buffer).metadata();
  const origWidth = metadata.width ?? 0;
  const origHeight = metadata.height ?? 0;
  const maxSide = Math.max(origWidth, origHeight);
  const target = maxSide > 200 ? 100 : maxSide;

  const image = sharp(buffer).resize({
    width: target,
    height: target,
    fit: 'inside',
  });

  const { data, info } = await image
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  return rgbaToThumbHash(info.width, info.height, data);
}