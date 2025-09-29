import { createServerFn } from '@tanstack/react-start';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import prisma from '@/lib/prisma';
import { utapi } from '@/lib/upload-thing';
import z from 'zod';


// Schema
export const removeNewsImageSchema = z.object({
  newsId: z.number()
});

// Server function
export const removeNewsImage = createServerFn({ method: 'POST' })
  .validator(removeNewsImageSchema)
  .handler(async ({ data }) => {
    const image = await prisma.newsImage.findUnique({ where: { newsId: data.newsId } });
    if (!image)
      throw new Error('Image not found');

    await prisma.$transaction(async (tx) => {
      await tx.newsImage.delete({ where: { newsId: data.newsId } });
      await utapi.deleteFiles([`${data.newsId}`]);
    });
  });


// React Hook
type TParams = Parameters<typeof removeNewsImage>[0];
type TOptions = Omit<UseMutationOptions<void, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useRemoveImageFromNews = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['news', 'image', 'delete'],
    mutationFn: (params) => removeNewsImage(params),
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