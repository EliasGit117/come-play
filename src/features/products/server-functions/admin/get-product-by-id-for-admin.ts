import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { queryOptions } from '@tanstack/react-query';
import { AdminProductDtoFactory } from '@/features/products/dtos/admin-product-dto';
import { z } from 'zod';

export const getProductByIdForAdminSchema = z.object({
  id: z.number()
});

export type TGetProductByIdForAdminSchema = z.infer<typeof getProductByIdForAdminSchema>;

export const getProductByIdForAdmin = createServerFn({ method: 'GET' })
  .inputValidator(getProductByIdForAdminSchema)
  .handler(async ({ data }) => {
    const product = await prisma.product.findUnique({
      where: { id: data.id },
      include: { images: true, subcategory: true }
    });
    if (!product)
      throw new Error(`Product ${data.id} not found`);

    return AdminProductDtoFactory.fromEntity(product);
  });

export function getProductByIdForAdminQueryOptions(id: number | string) {
  const parsedId = typeof id === "string" ? z.coerce.number().parse(id) : id;

  return queryOptions({
    queryKey: ['admin', 'product', parsedId],
    queryFn: () => getProductByIdForAdmin({ data: { id: parsedId } }),
    staleTime: 30_000,
    gcTime: 30_000
  });
}