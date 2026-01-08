import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';


export const deleteSubcategoriesByIdsSchema = z.object({
  ids: z.array(z.number()),
});

export type TDeleteSubcategoriesByIdsSchema = z.infer<typeof deleteSubcategoriesByIdsSchema>;

export const deleteSubcategoriesByIds = createServerFn({ method: 'POST' })
  .inputValidator(deleteSubcategoriesByIdsSchema)
  .handler(async ({ data: { ids } }) => {
    const subcategories = await prisma.subcategory.findMany({
      where: { id: { in: ids } },
      include: { products: true },
    });

    if (!subcategories.length)
      throw new Error('No subcategories found.');

    const deletable = subcategories.filter((s) => s.products.length === 0).map((s) => s.id);

    const deletedCount = await prisma.subcategory.deleteMany({
      where: { id: { in: deletable } },
    });

    if (deletedCount.count < ids.length)
      throw new Error(`Some could not be deleted because they contain products.`);

    return { deletedCount: deletedCount.count };
  });

type TResult = Awaited<ReturnType<typeof deleteSubcategoriesByIds>>;
type TParams = Parameters<typeof deleteSubcategoriesByIds>[0];
type TOptions = Omit<UseMutationOptions<TResult, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useDeleteSubcategoriesByIdsMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['admin', 'subcategories', 'delete', 'multiple'],
    mutationFn: (params) => deleteSubcategoriesByIds(params),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] === 'admin' && q.queryKey[1] === 'subcategories' });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};