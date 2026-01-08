import { createServerFn } from '@tanstack/react-start';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import prisma from '@/lib/prisma';
import { utapi } from '@/lib/upload-thing';
import { z } from 'zod'
import { BannerImageType } from '@prisma/client';

export const removeBannerImageSchema = z.object({
  bannerId: z.number(),
  imageType: z.nativeEnum(BannerImageType)
});

export const removeBannerImageFn = createServerFn({ method: 'POST' })
  .inputValidator(removeBannerImageSchema)
  .handler(async ({ data }) => {
    await removeBannerImage(data.bannerId, data.imageType);
  });

type TParams = Parameters<typeof removeBannerImageFn>[0];
type TOptions = Omit<UseMutationOptions<void, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useRemoveBannerImage = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['banners', 'image', 'delete'],
    mutationFn: (params) => removeBannerImageFn(params),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'banners' && query.queryKey[1] === 'paginated'
      });

      void queryClient.invalidateQueries({ queryKey: ['banners', variables.data.bannerId] });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};

export async function removeBannerImage(bannerId: number, imageType: BannerImageType) {
  "use server";

  const fieldMap = {
    [BannerImageType.desktop]: 'desktopBannerId',
    [BannerImageType.tablet]: 'tabletBannerId',
    [BannerImageType.mobile]: 'mobileBannerId'
  };

  const image = await prisma.bannerImage.findFirst({
    where: { [fieldMap[imageType]]: bannerId }
  });

  if (!image) return;

  await prisma.$transaction(async (tx) => {
    await tx.bannerImage.delete({ where: { id: image.id } });
    await utapi.deleteFiles([`banner-${[fieldMap[imageType]]}-${image.id}`], { keyType: "customId" });
  });
}


export async function removeAllBannerImages(bannerId: number) {
  "use server";

  const banner = await prisma.banner.findUnique({
    where: { id: bannerId },
    include: {
      desktopImage: true,
      tabletImage: true,
      mobileImage: true
    }
  });

  if (!banner)
    throw new Error('Banner has not been found');

  const images = [
    banner.desktopImage,
    banner.tabletImage,
    banner.mobileImage
  ].filter((img): img is NonNullable<typeof img> => img !== null);

  if (images.length === 0)
    return;

  await prisma.$transaction(async (tx) => {
    const imageIds = images.map(img => img.id);

    await tx.bannerImage.deleteMany({ where: { id: { in: imageIds } } });

    const customIds = images.map(img => {
      if (img.desktopBannerId)
        return `banner-desktopBannerId-${img.id}`;

      if (img.tabletBannerId)
        return `banner-tabletBannerId-${img.id}`;

      if (img.mobileBannerId)
        return `banner-mobileBannerId-${img.id}`;

      return null;
    }).filter((id): id is string => id !== null);

    if (customIds.length > 0) {
      await utapi.deleteFiles(customIds, { keyType: "customId" });
    }
  });
}