import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const deleteBannerByIdSchema = z.object({
  id: z.number().int().positive()
});

export type TDeleteBannerByIdParams = z.infer<typeof deleteBannerByIdSchema>;

export const deleteBannerById = createServerFn({ method: 'POST' })
  .inputValidator(deleteBannerByIdSchema)
  .handler(async ({ data }) => {
    const banner = await prisma.banner.findUnique({ where: { id: data.id } });

    if (!banner)
      throw new Error('Banner not found');

    await prisma.$transaction(async (tx) => {
      await tx.banner.delete({ where: { id: data.id } });

      const bannersToUpdate = await tx.banner.findMany({
        where: { order: { gt: banner.order } },
        orderBy: { order: 'asc' }
      });

      // Reorder them by decrementing their order by 1
      for (const bannerToUpdate of bannersToUpdate) {
        await tx.banner.update({
          where: { id: bannerToUpdate.id },
          data: { order: bannerToUpdate.order - 1 }
        });
      }
    });

    return { success: true };
  });

export const useDeleteBannerMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBannerById,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['banners'] });
      options?.onSuccess?.();
    },
    onError: options?.onError
  });
};