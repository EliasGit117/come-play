import { z } from 'zod';
import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { productsAdminBase, productsAdminPath } from './base';

export const adminProductsReorderImages = productsAdminBase
  .route({
    method: 'POST',
    path: `${productsAdminPath}/reorder-images`,
    summary: 'Reorder product images',
    description: 'Updates the order of a product\'s images',
  })
  .errors({ FORBIDDEN: {}, NOT_FOUND: {}, BAD_REQUEST: {} })
  .use(authMiddleware)
  .input(z.object({ productId: z.number(), imageIds: z.array(z.number()).min(1) }))
  .output(type<{ success: boolean }>())
  .handler(async ({ input, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { products: ['update'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const { productId, imageIds } = input;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: { select: { id: true } } },
    });
    if (!product)
      throw errors.NOT_FOUND({ message: `Product with id=${productId} not found` });

    const uniqueIds = new Set(imageIds);
    if (uniqueIds.size !== imageIds.length)
      throw errors.BAD_REQUEST({ message: 'Duplicate image IDs are not allowed' });

    const existingIds = new Set(product.images.map((img) => img.id));
    const invalidIds = imageIds.filter((id) => !existingIds.has(id));
    if (invalidIds.length > 0)
      throw errors.BAD_REQUEST({
        message: `The following images do not belong to product ${productId}: ${invalidIds.join(', ')}`,
      });

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
