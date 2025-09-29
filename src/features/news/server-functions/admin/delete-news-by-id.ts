import z from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';


export const deleteNewsByIdSchema = z.object({
  id: z.number()
});
export type TDeleteNewsByIdParams = z.infer<typeof deleteNewsByIdSchema>;


export const deleteNewsById = createServerFn({ method: 'POST' })
  .validator(deleteNewsByIdSchema)
  .handler(async ({ data: { id } }) => {

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