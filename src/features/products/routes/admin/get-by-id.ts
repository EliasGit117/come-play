import { z } from 'zod';
import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { productsAdminBase, productsAdminPath } from './base';
import { AdminProductDtoFactory, IAdminProductDto } from '@/features/products/dtos/admin-product-dto';

export const adminProductsGetById = productsAdminBase
  .route({
    method: 'GET',
    path: `${productsAdminPath}/{id}`,
    summary: 'Get product by id',
    description: 'Returns a single product with its images',
  })
  .errors({ FORBIDDEN: {}, NOT_FOUND: {} })
  .use(authMiddleware)
  .input(z.object({ id: z.number() }))
  .output(type<IAdminProductDto>())
  .handler(async ({ input, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { products: ['get'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const product = await prisma.product.findUnique({
      where: { id: input.id },
      include: { images: true, subcategory: true },
    });

    if (!product)
      throw errors.NOT_FOUND({ message: `Product ${input.id} not found` });

    return AdminProductDtoFactory.fromEntity(product);
  });
