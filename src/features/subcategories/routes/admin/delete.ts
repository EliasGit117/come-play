import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { subcategoriesAdminBase, subcategoriesAdminPath } from './base';
import { deleteSubcategoriesByIdsSchema } from '@/features/subcategories/schemas/search-subcategories';

interface IDeleteSubcategoriesResult {
  deletedCount: number;
}

export const adminSubcategoriesDelete = subcategoriesAdminBase
  .route({
    method: 'POST',
    path: `${subcategoriesAdminPath}/delete`,
    summary: 'Delete subcategories',
    description: 'Deletes subcategories by ids when they have no products',
  })
  .errors({ FORBIDDEN: {}, BAD_REQUEST: {}, CONFLICT: {} })
  .use(authMiddleware)
  .input(deleteSubcategoriesByIdsSchema)
  .output(type<IDeleteSubcategoriesResult>())
  .handler(async ({ input: { ids }, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { subcategories: ['delete'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const subcategories = await prisma.subcategory.findMany({
      where: { id: { in: ids } },
      include: { products: true },
    });

    if (!subcategories.length)
      throw errors.BAD_REQUEST({ message: 'No subcategories found.' });

    const deletable = subcategories.filter((s) => s.products.length === 0).map((s) => s.id);

    const deletedCount = await prisma.subcategory.deleteMany({
      where: { id: { in: deletable } },
    });

    if (deletedCount.count < ids.length)
      throw errors.CONFLICT({ message: 'Some could not be deleted because they contain products.' });

    return { deletedCount: deletedCount.count };
  });
