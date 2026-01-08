// @/features/products/server-functions/admin/delete-product-image.ts
import { createServerFn } from '@tanstack/react-start';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import prisma from '@/lib/prisma';
import { utapi } from '@/lib/upload-thing';
import { z } from 'zod';

export const deleteProductImageSchema = z.object({
  productId: z.number(),
  imageId: z.number()
});

export const deleteProductImageFn = createServerFn({ method: 'POST' })
  .inputValidator(deleteProductImageSchema)
  .handler(async ({ data }) => {
    await deleteProductImage(data.productId, data.imageId);
  });

type TParams = Parameters<typeof deleteProductImageFn>[0];
type TOptions = Omit<
  UseMutationOptions<void, Error, TParams>,
  'mutationFn' | 'onMutate'
>;

export const usedeleteProductImage = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['products', 'image', 'delete'],
    mutationFn: (params) => deleteProductImageFn(params),
    ...options,
    onSuccess: (data, variables, ...ctx) => {
      void queryClient.invalidateQueries({
        queryKey: ['admin', 'product', variables.data.productId]
      });
      void queryClient.invalidateQueries({
        queryKey: ['admin', 'products']
      });
      options?.onSuccess?.(data, variables, ...ctx);
    }
  });
};

export async function deleteProductImage(productId: number, imageId: number) {
  'use server';

  const image = await prisma.productImage.findFirst({
    where: { id: imageId, productId }
  });

  if (!image) return;

  await prisma.$transaction(async (tx) => {
    // Get the order of the image being deleted
    const deletedOrder = image.order;

    // Delete the image
    await tx.productImage.delete({ where: { id: image.id } });

    // Reorder remaining images
    await tx.productImage.updateMany({
      where: {
        productId,
        order: { gt: deletedOrder }
      },
      data: {
        order: { decrement: 1 }
      }
    });

    // Delete from storage
    await utapi.deleteFiles([`product-${image.id}`], { keyType: 'customId' });
  });
}