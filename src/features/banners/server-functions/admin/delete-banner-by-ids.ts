import { z } from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { removeAllBannerImages } from '@/features/banners/server-functions/admin/remove-banner-image';

export const deleteBannersByIdsSchema = z.object({
  ids: z.array(z.number())
});

export type TDeleteBannersByIdsParams = z.infer<typeof deleteBannersByIdsSchema>;

export const deleteBannersByIds = createServerFn({ method: 'POST' })
  .inputValidator(deleteBannersByIdsSchema)
  .handler(async ({ data: { ids } }) => {
    const imageDeletionResults: {
      bannerId: number;
      success: boolean;
      error?: string;
    }[] = [];

    const banners = await prisma.banner.findMany({
      where: { id: { in: ids } },
      orderBy: { order: 'asc' }
    });

    if (banners.length === 0)
      throw new Error('No banners found for given IDs.');

    for (const banner of banners) {
      try {
        await removeAllBannerImages(banner.id);
        imageDeletionResults.push({ bannerId: banner.id, success: true });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);
        imageDeletionResults.push({
          bannerId: banner.id,
          success: false,
          error: message
        });
      }
    }

    const failedBannerIds = imageDeletionResults
      .filter((r) => !r.success)
      .map((r) => r.bannerId);

    const successBannerIds = ids.filter(
      (id) => !failedBannerIds.includes(id)
    );

    let deletedCount = 0;
    if (successBannerIds.length > 0) {
      await prisma.$transaction(async (tx) => {
        const result = await tx.banner.deleteMany({
          where: { id: { in: successBannerIds } }
        });
        deletedCount = result.count;

        const remaining = await tx.banner.findMany({
          orderBy: { order: 'asc' }
        });

        for (let i = 0; i < remaining.length; i++) {
          await tx.banner.update({
            where: { id: remaining[i].id },
            data: { order: i + 1 }
          });
        }
      });
    }

    if (failedBannerIds.length > 0) {
      throw new Error(
        `Failed to remove images for some banners. Deleted ${deletedCount} of ${
          ids.length
        }. Failures: ${failedBannerIds.join(', ')}`
      );
    }

    return {
      totalRequested: ids.length,
      deletedCount,
      failedCount: failedBannerIds.length,
      imageDeletions: imageDeletionResults
    };
  });

// ---------- React Hook ----------
type TResult = Awaited<ReturnType<typeof deleteBannersByIds>>;
type TParams = Parameters<typeof deleteBannersByIds>[0];
type TOptions = Omit<
  UseMutationOptions<TResult, Error, TParams>,
  'mutationFn' | 'onMutate'
>;

export const useDeleteBannersByIdsMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['admin', 'banners', 'delete', 'multiple'],
    mutationFn: (params) => deleteBannersByIds(params),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'admin' && query.queryKey[1] === 'banners' });
      void queryClient.refetchQueries({ predicate: (query) => query.queryKey[0] === 'admin' && query.queryKey[1] === 'banners' });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};