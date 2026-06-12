import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { utapi } from '@/lib/upload-thing';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { productsAdminBase, productsAdminPath } from './base';
import { deleteProductsByIdsSchema } from '@/features/products/schemas/search-products';

interface IDeleteProductsResult {
  totalRequested: number;
  deletedCount: number;
}

export const adminProductsDelete = productsAdminBase
  .route({
    method: 'POST',
    path: `${productsAdminPath}/delete`,
    summary: 'Delete products',
    description: 'Deletes products by ids and their images',
  })
  .errors({ FORBIDDEN: {}, BAD_REQUEST: {} })
  .use(authMiddleware)
  .input(deleteProductsByIdsSchema)
  .output(type<IDeleteProductsResult>())
  .handler(async ({ input: { ids }, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { products: ['delete'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const products = await prisma.product.findMany({
      where: { id: { in: ids } },
      include: { images: true },
    });

    if (products.length === 0)
      throw errors.BAD_REQUEST({ message: 'No products found for given IDs.' });

    const allImages = products.flatMap((p) => p.images);
    const customIds = allImages.map((img) => `product-${img.id}`);

    let deletedCount = 0;
    await prisma.$transaction(async (tx) => {
      if (customIds.length > 0)
        await utapi.deleteFiles(customIds, { keyType: 'customId' });

      const result = await tx.product.deleteMany({ where: { id: { in: ids } } });
      deletedCount = result.count;
    });

    return {
      totalRequested: ids.length,
      deletedCount,
    };
  });
