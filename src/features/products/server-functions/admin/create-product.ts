import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { createProductSchema } from '@/features/products/schemas/create-product';
import { AdminProductBriefDtoFactory } from '@/features/products/dtos/admin-product-brief-dto';


export const createProduct = createServerFn({ method: 'POST' })
  .inputValidator(createProductSchema)
  .handler(async ({ data }) => {
    const product = await prisma.product.create({ data });

    return AdminProductBriefDtoFactory.fromEntity(product);
  });

type TResult = Awaited<ReturnType<typeof createProduct>>;
type TParams = Parameters<typeof createProduct>[0]['data'];
type TOptions = Omit<UseMutationOptions<TResult, Error, TParams>, 'mutationFn'>;

export const useCreateProductMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['admin', 'products', 'create'],
    mutationFn: (params) => createProduct({ data: params }),
    ...options,
    onSuccess: (data, variables, c, ctx) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      options?.onSuccess?.(data, variables, c, ctx);
    }
  });
};