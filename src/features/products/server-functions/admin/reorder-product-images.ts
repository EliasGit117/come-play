import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';


export const reorderProductImagesSchema = z.object({
  productId: z.number(),
  imageIds: z.array(z.number()).min(1),
});

export type TReorderProductImagesSchema = z.infer<
  typeof reorderProductImagesSchema
>;


export const reorderProductImages = createServerFn({ method: 'POST' })
  .inputValidator(reorderProductImagesSchema)
  .handler(async ({ data }) => {
    const { productId, imageIds } = data;

    // 1. Validate product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: { select: { id: true } } },
    });
    if (!product) throw new Error(`Product with id=${productId} not found`);

    // 2. Check for duplicates
    const uniqueIds = new Set(imageIds);
    if (uniqueIds.size !== imageIds.length) {
      throw new Error('Duplicate image IDs are not allowed');
    }

    // 3. Validate all provided IDs belong to this product
    const existingIds = new Set(product.images.map((img) => img.id));
    const invalidIds = imageIds.filter((id) => !existingIds.has(id));
    if (invalidIds.length > 0) {
      throw new Error(
        `The following images do not belong to product ${productId}: ${invalidIds.join(
          ', '
        )}`,
      );
    }

    // 4. Run updates in a single transaction
    await prisma.$transaction(
      imageIds.map((id, index) =>
        prisma.productImage.update({
          where: { id },
          data: { order: index + 1 },
        }),
      ),
    );

    return { success: true };
  });


type TParams = Parameters<typeof reorderProductImages>[0]['data'];
type TOptions = Omit<
  UseMutationOptions<{ success: boolean }, Error, TParams>,
  'mutationFn'
>;

export const useReorderProductImagesMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['products', 'images', 'reorder'],
    mutationFn: (params) => reorderProductImages({ data: params }),
    ...options,

    onSuccess: (data, variables, ...ctx) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'product', variables.productId], });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'products'], });

      options?.onSuccess?.(data, variables, ...ctx);
    },
  });
};