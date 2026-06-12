import { z } from 'zod';
import { type } from '@orpc/server';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { productsAdminBase, productsAdminPath } from './base';
import { deleteProductImage } from '@/features/products/services/product-image-service';

export const adminProductsDeleteImage = productsAdminBase
  .route({
    method: 'POST',
    path: `${productsAdminPath}/delete-image`,
    summary: 'Delete product image',
    description: 'Removes an image from a product and reorders remaining images',
  })
  .errors({ FORBIDDEN: {} })
  .use(authMiddleware)
  .input(z.object({ productId: z.number(), imageId: z.number() }))
  .output(type<void>())
  .handler(async ({ input, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { products: ['update'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    await deleteProductImage(input.productId, input.imageId);
  });
