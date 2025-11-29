import { z } from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { removeImageFromNews } from '@/features/news/server-functions/admin/remove-image-from-news';

export const deleteNewsByIdsSchema = z.object({
  ids: z.array(z.number())
});

export type TDeleteNewsByIdsParams = z.infer<typeof deleteNewsByIdsSchema>;

export const deleteNewsByIds = createServerFn({ method: 'POST' })
  .inputValidator(deleteNewsByIdsSchema)
  .handler(async ({ data: { ids } }) => {
    const imageDeletionResults: { newsId: number; success: boolean; error?: string; }[] = [];

    const relatedImages = await prisma.newsImage.findMany({
      where: { newsId: { in: ids } }
    });

    console.log('rel',relatedImages)

    for (const img of relatedImages) {
      try {
        await removeImageFromNews(img.newsId);
        imageDeletionResults.push({ newsId: img.newsId, success: true });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);
        imageDeletionResults.push({
          newsId: img.newsId,
          success: false,
          error: message
        });
      }
    }

    const failedImageIds = imageDeletionResults
      .filter((r) => !r.success)
      .map((r) => r.newsId);

    const deletableNewsIds = ids.filter((id) => !failedImageIds.includes(id));

    let deletedCount = 0;
    if (deletableNewsIds.length > 0) {
      await prisma.$transaction(async (tx) => {
        const result = await tx.news.deleteMany({
          where: { id: { in: deletableNewsIds } }
        });
        deletedCount = result.count;
      });
    }

    if (failedImageIds.length > 0) {
      throw new Error(
        `Some images could not be deleted. Deleted ${deletedCount} of ${
          ids.length
        } news. Failed in: ${failedImageIds.join(', ')}`
      );
    }

    return {
      totalReceived: ids.length,
      newsDeletedCount: deletedCount,
      imageDeletions: imageDeletionResults
    };
  });

type TResult = Awaited<ReturnType<typeof deleteNewsByIds>>;
type TParams = Parameters<typeof deleteNewsByIds>[0];
type TOptions = Omit<
  UseMutationOptions<TResult, Error, TParams>,
  'mutationFn' | 'onMutate'
>;

export const useDeleteNewsByIdsMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['admin', 'news', 'delete', 'multiple'],
    mutationFn: (params) => deleteNewsByIds(params),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'admin' &&
          query.queryKey[1] === 'news' &&
          query.queryKey[2] === 'paginated'
      });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};