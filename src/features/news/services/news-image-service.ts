import prisma from '@/lib/prisma';
import { utapi } from '@/lib/upload-thing';

export async function removeImageFromNews(newsId: number) {
  const image = await prisma.newsImage.findUnique({ where: { newsId: newsId } });
  if (!image)
    throw new Error('Image not found');

  await prisma.$transaction(async (tx) => {
    await tx.newsImage.delete({ where: { newsId: newsId } });
    await utapi.deleteFiles([`news-banner-${image.id}`], { keyType: 'customId' });
  });
}

export function generateNewsImageName(filename: string, id: string | number) {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1)
    throw new Error(`File name doesn't have file extension`);

  const extension = filename.slice(lastDotIndex);
  return `news-banner-${id}${extension}`;
}
