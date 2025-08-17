import z from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';

export const deleteNewsByIdSchema = z.object({
  id: z.number().int().positive()
});

export type TDeleteNewsByIdSchema = z.infer<typeof deleteNewsByIdSchema>;

export const deleteNewsById = createServerFn({ method: 'POST' })
  .validator(deleteNewsByIdSchema)
  .handler(async ({ data }) => {
    const existingNews = await prisma.news.findUnique({ where: { id: data.id } });

    if (!existingNews) {
      throw new Error('News with this ID does not exist');
    }

    await prisma.news.delete({ where: { id: data.id } });

    return { success: true, id: data.id };
  });

type TParams = Parameters<typeof deleteNewsById>[0]['data']['id'];
type TOptions = Omit<UseMutationOptions<{ success: boolean; id: number }, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useDeleteNewsMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['news', 'delete'],
    mutationFn: (value: TParams) => deleteNewsById({ data: { id: value } }),
    ...options,

    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'news' && query.queryKey[1] === 'paginated' }).then();

      options?.onSuccess?.(data, variables, context);
    },
  });
};