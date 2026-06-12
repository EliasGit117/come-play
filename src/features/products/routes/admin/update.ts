import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { productsAdminBase } from './base';
import { editProductSchema } from '@/features/products/schemas/edit-product';
import { AdminProductBriefDtoFactory, IAdminProductBriefDto } from '@/features/products/dtos/admin-product-brief-dto';

export const adminProductsUpdate = productsAdminBase
  .route({
    method: 'PUT',
    summary: 'Update product',
    description: 'Updates an existing product',
  })
  .errors({ FORBIDDEN: {} })
  .use(authMiddleware)
  .input(editProductSchema)
  .output(type<IAdminProductBriefDto>())
  .handler(async ({ input: data, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { products: ['update'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const { id, ...rest } = data;
    const updated = await prisma.product.update({ where: { id }, data: rest });

    return AdminProductBriefDtoFactory.fromEntity(updated);
  });
