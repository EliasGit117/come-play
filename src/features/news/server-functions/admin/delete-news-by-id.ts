import z from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { removeImageFromNews } from '@/features/news/server-functions/admin/remove-image-from-news';


export const deleteNewsByIdSchema = z.object({
  id: z.number()
});
export type TDeleteNewsByIdParams = z.infer<typeof deleteNewsByIdSchema>;


export const deleteNewsById = createServerFn({ method: 'POST' })
  .inputValidator(deleteNewsByIdSchema)
  .handler(async ({ data: { id } }) => {
    const existingImage = await prisma.newsImage.findUnique({ where: { newsId: id } });
    if (!!existingImage)
      await removeImageFromNews(id);

    await prisma.news.delete({ where: { id } });
  });


type TParams = Parameters<typeof deleteNewsById>[0];
type TOptions = Omit<UseMutationOptions<void, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useDeleteNewsMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['news', 'delete'],
    mutationFn: (params) => deleteNewsById(params),
    ...options,
    onSuccess: (data, variables, context) => {
      void queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'news' && query.queryKey[1] === 'paginated'
      });

      options?.onSuccess?.(data, variables, context);
    }
  });
};