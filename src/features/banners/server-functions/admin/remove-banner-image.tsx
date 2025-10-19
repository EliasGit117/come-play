import { createServerFn } from '@tanstack/react-start';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import prisma from '@/lib/prisma';
import { utapi } from '@/lib/upload-thing';
import z from 'zod';
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
    await utapi.deleteFiles([`${image.id}`], { keyType: "customId" });
  });
}