import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { categoriesAdminBase, categoriesAdminPath } from './base';
import { deleteCategoriesByIdsSchema } from '@/features/categories/schemas/search-categories';

interface IDeleteCategoriesResult {
  totalRequested: number;
  deletedCount: number;
  failedCount: number;
  results: { categoryId: number; success: boolean; error?: string }[];
}

export const adminCategoriesDelete = categoriesAdminBase
  .route({
    method: 'POST',
    path: `${categoriesAdminPath}/delete`,
    summary: 'Delete categories',
    description: 'Deletes categories by ids when they have no subcategories',
  })
  .errors({ FORBIDDEN: {}, BAD_REQUEST: {} })
  .use(authMiddleware)
  .input(deleteCategoriesByIdsSchema)
  .output(type<IDeleteCategoriesResult>())
  .handler(async ({ input: { ids }, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { categories: ['delete'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const deletionResults: IDeleteCategoriesResult['results'] = [];

    const categories = await prisma.category.findMany({
      where: { id: { in: ids } },
      include: { subcategories: true },
      orderBy: { id: 'asc' },
    });

    if (categories.length === 0)
      throw errors.BAD_REQUEST({ message: 'No categories found for given IDs.' });

    const deletableIds: number[] = [];

    for (const category of categories) {
      if (category.subcategories.length > 0) {
        deletionResults.push({
          categoryId: category.id,
          success: false,
          error: `Category "${category.nameRo}" has subcategories and cannot be deleted.`,
        });
        continue;
      }

      deletableIds.push(category.id);
    }

    let deletedCount = 0;

    if (deletableIds.length > 0) {
      deletedCount = await prisma.category
        .deleteMany({ where: { id: { in: deletableIds } } })
        .then((res) => res.count);

      for (const id of deletableIds) {
        deletionResults.push({ categoryId: id, success: true });
      }
    }

    const failedCount = deletionResults.filter((r) => !r.success).length;

    return {
      totalRequested: ids.length,
      deletedCount,
      failedCount,
      results: deletionResults,
    };
  });
