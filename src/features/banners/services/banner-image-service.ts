import prisma from '@/lib/prisma';
import { utapi } from '@/lib/upload-thing';
import { BannerImageType } from '@prisma/client';

export const bannerImageFieldMap = {
  [BannerImageType.desktop]: 'desktopBannerId',
  [BannerImageType.tablet]: 'tabletBannerId',
  [BannerImageType.mobile]: 'mobileBannerId',
} as const;

export function generateBannerImageName(filename: string, id: string | number, imageType: BannerImageType) {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1)
    throw new Error(`File name doesn't have file extension`);

  const extension = filename.slice(lastDotIndex);
  return `banner-${id}-${imageType}${extension}`;
}

export async function removeBannerImage(bannerId: number, imageType: BannerImageType) {
  const image = await prisma.bannerImage.findFirst({
    where: { [bannerImageFieldMap[imageType]]: bannerId },
  });

  if (!image) return;

  await prisma.$transaction(async (tx) => {
    await tx.bannerImage.delete({ where: { id: image.id } });
    await utapi.deleteFiles([`banner-${[bannerImageFieldMap[imageType]]}-${image.id}`], { keyType: 'customId' });
  });
}

export async function removeAllBannerImages(bannerId: number) {
  const banner = await prisma.banner.findUnique({
    where: { id: bannerId },
    include: { desktopImage: true, tabletImage: true, mobileImage: true },
  });

  if (!banner)
    throw new Error('Banner has not been found');

  const images = [banner.desktopImage, banner.tabletImage, banner.mobileImage]
    .filter((img): img is NonNullable<typeof img> => img !== null);

  if (images.length === 0)
    return;

  await prisma.$transaction(async (tx) => {
    const imageIds = images.map((img) => img.id);

    await tx.bannerImage.deleteMany({ where: { id: { in: imageIds } } });

    const customIds = images.map((img) => {
      if (img.desktopBannerId) return `banner-desktopBannerId-${img.id}`;
      if (img.tabletBannerId) return `banner-tabletBannerId-${img.id}`;
      if (img.mobileBannerId) return `banner-mobileBannerId-${img.id}`;
      return null;
    }).filter((id): id is string => id !== null);

    if (customIds.length > 0)
      await utapi.deleteFiles(customIds, { keyType: 'customId' });
  });
}
