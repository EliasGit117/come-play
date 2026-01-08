import { z } from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { utapi } from '@/lib/upload-thing';

export const deleteProductsByIdsSchema = z.object({
  ids: z.array(z.number())
});

export type TDeleteProductsByIdsParams = z.infer<typeof deleteProductsByIdsSchema>;

export const deleteProductsByIds = createServerFn({ method: 'POST' })
  .inputValidator(deleteProductsByIdsSchema)
  .handler(async ({ data: { ids } }) => {
    const products = await prisma.product.findMany({
      where: { id: { in: ids } },
      include: { images: true }
    });

    if (products.length === 0)
      throw new Error('No products found for given IDs.');

    const allImages = products.flatMap((p) => p.images);
    const customIds = allImages.map((img) => `product-${img.id}`);

    let deletedCount = 0;
    await prisma.$transaction(async (tx) => {
      if (customIds.length > 0)
        await utapi.deleteFiles(customIds, { keyType: 'customId' });

      const result = await tx.product.deleteMany({ where: { id: { in: ids } } });
      deletedCount = result.count;
    });

    return {
      totalRequested: ids.length,
      deletedCount
    };
  });

type TResult = Awaited<ReturnType<typeof deleteProductsByIds>>;
type TParams = Parameters<typeof deleteProductsByIds>[0];
type TOptions = Omit<
  UseMutationOptions<TResult, Error, TParams>,
  'mutationFn' | 'onMutate'
>;

export const useDeleteProductsByIdsMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['admin', 'products', 'delete', 'multiple'],
    mutationFn: (params) => deleteProductsByIds(params),
    ...options,
    onSuccess: async (data, variables, ...ctx) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      options?.onSuccess?.(data, variables, ...ctx);
    }
  });
};