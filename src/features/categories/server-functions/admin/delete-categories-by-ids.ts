import { z } from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';

export const deleteCategoriesByIdsSchema = z.object({
  ids: z.array(z.number()),
});

export type TDeleteCategoriesByIdsParams = z.infer<
  typeof deleteCategoriesByIdsSchema
>;


export const deleteCategoriesByIds = createServerFn({ method: 'POST' })
  .inputValidator(deleteCategoriesByIdsSchema)
  .handler(async ({ data: { ids } }) => {
    const deletionResults: {
      categoryId: number;
      success: boolean;
      error?: string;
    }[] = [];

    const categories = await prisma.category.findMany({
      where: { id: { in: ids } },
      include: { subcategories: true },
      orderBy: { id: 'asc' },
    });

    if (categories.length === 0)
      throw new Error('No categories found for given IDs.');

    const deletableIds: number[] = [];

    for (const category of categories) {
      if (category.subcategories.length > 0) {
        deletionResults.push({
          categoryId: category.id,
          success: false,
          error: `Category "${category.nameRo}" has subcategories and cannot be deleted.`,
        });
        continue;
      }

      deletableIds.push(category.id);
    }

    let deletedCount = 0;

    if (deletableIds.length > 0) {
      deletedCount = await prisma.category
        .deleteMany({ where: { id: { in: deletableIds } }, })
        .then((res) => res.count);

      for (const id of deletableIds) {
        deletionResults.push({ categoryId: id, success: true });
      }
    }

    const failedCount = deletionResults.filter((r) => !r.success).length;

    if (failedCount > 0) {
      const failedIds = deletionResults
        .filter((r) => !r.success)
        .map((r) => r.categoryId)
        .join(', ');

      throw new Error(
        `Some categories were not deleted. Deleted ${deletedCount} of ${
          ids.length
        }. Categories with subcategories: ${failedIds}`
      );
    }

    return {
      totalRequested: ids.length,
      deletedCount,
      failedCount,
      results: deletionResults,
    };
  });


type TResult = Awaited<ReturnType<typeof deleteCategoriesByIds>>;
type TParams = Parameters<typeof deleteCategoriesByIds>[0];
type TOptions = Omit<UseMutationOptions<TResult, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useDeleteCategoriesByIdsMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['admin', 'categories', 'delete', 'multiple'],
    mutationFn: (params) => deleteCategoriesByIds(params),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'admin' && query.queryKey[1] === 'categories' });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};