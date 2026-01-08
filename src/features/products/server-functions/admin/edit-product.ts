import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { editProductSchema } from '@/features/products/schemas/edit-product';
import { AdminProductBriefDtoFactory } from '@/features/products/dtos/admin-product-brief-dto';

export const editProduct = createServerFn({ method: 'POST' })
  .inputValidator(editProductSchema)
  .handler(async ({ data }) => {
    const { id, ...rest } = data;
    const updated = await prisma.product.update({ where: { id }, data: rest });

    return AdminProductBriefDtoFactory.fromEntity(updated);
  });

export const useEditProductMutation = (options?: Omit<
  UseMutationOptions<Awaited<ReturnType<typeof editProduct>>, Error, any>,
  'mutationFn'
>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['admin', 'products', 'edit'],
    mutationFn: (params) => editProduct({ data: params }),
    ...options,
    onSuccess: (data, vars, c, ctx) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      void queryClient.invalidateQueries({ queryKey: ['product', data.id] });
      options?.onSuccess?.(data, vars, c, ctx);
    }
  });
};