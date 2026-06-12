import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { productsAdminBase } from './base';
import { createProductSchema } from '@/features/products/schemas/create-product';
import { AdminProductBriefDtoFactory, IAdminProductBriefDto } from '@/features/products/dtos/admin-product-brief-dto';

export const adminProductsCreate = productsAdminBase
  .route({
    method: 'POST',
    summary: 'Create product',
    description: 'Creates a new product',
  })
  .errors({ FORBIDDEN: {} })
  .use(authMiddleware)
  .input(createProductSchema)
  .output(type<IAdminProductBriefDto>())
  .handler(async ({ input: data, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { products: ['create'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const product = await prisma.product.create({ data });

    return AdminProductBriefDtoFactory.fromEntity(product);
  });
