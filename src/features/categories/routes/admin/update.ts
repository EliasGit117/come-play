import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { categoriesAdminBase } from './base';
import { editCategorySchema } from '@/features/categories/schemas/edit-category';
import { AdminCategoryBriefDtoFactory, IAdminCategoryBriefDto } from '@/features/categories/dtos/admin-category-brief-dto';

export const adminCategoriesUpdate = categoriesAdminBase
  .route({
    method: 'PUT',
    summary: 'Update category',
    description: 'Updates an existing category',
  })
  .errors({ FORBIDDEN: {}, NOT_FOUND: {}, CONFLICT: {} })
  .use(authMiddleware)
  .input(editCategorySchema)
  .output(type<IAdminCategoryBriefDto>())
  .handler(async ({ input: data, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { categories: ['update'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const { id, nameRo, nameRu, slug } = data;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing)
      throw errors.NOT_FOUND({ message: 'Category not found' });

    const withSameSlug = await prisma.category.findFirst({
      where: {
        NOT: { id },
        slug: slug,
      },
    });

    if (withSameSlug)
      throw errors.CONFLICT({ message: 'There is another category with same slug' });

    const category = await prisma.category.update({
      where: { id },
      data: {
        nameRo: nameRo,
        nameRu: nameRu,
        descriptionRo: data.descriptionRo || null,
        descriptionRu: data.descriptionRu || null,
        slug: slug,
      },
    });

    return AdminCategoryBriefDtoFactory.fromEntity(category);
  });
