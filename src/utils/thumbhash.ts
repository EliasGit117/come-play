import { rgbaToThumbHash } from "thumbhash";

export async function createThumbhashFromFile(file: File): Promise<string> {
  const imgBitmap = await createImageBitmap(file);

  const maxSize = 100;
  let targetW = imgBitmap.width;
  let targetH = imgBitmap.height;

  if (targetW > targetH && targetW > maxSize) {
    targetH = (targetH * maxSize) / targetW;
    targetW = maxSize;
  } else if (targetH > maxSize) {
    targetW = (targetW * maxSize) / targetH;
    targetH = maxSize;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(targetW);
  canvas.height = Math.round(targetH);

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(imgBitmap, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const hash = rgbaToThumbHash(canvas.width, canvas.height, imageData.data);

  return btoa(String.fromCharCode(...hash));
}