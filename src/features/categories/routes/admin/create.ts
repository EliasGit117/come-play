import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { categoriesAdminBase } from './base';
import { createCategorySchema } from '@/features/categories/schemas/create-category';
import { AdminCategoryBriefDtoFactory, IAdminCategoryBriefDto } from '@/features/categories/dtos/admin-category-brief-dto';

export const adminCategoriesCreate = categoriesAdminBase
  .route({
    method: 'POST',
    summary: 'Create category',
    description: 'Creates a new category',
  })
  .errors({ FORBIDDEN: {} })
  .use(authMiddleware)
  .input(createCategorySchema)
  .output(type<IAdminCategoryBriefDto>())
  .handler(async ({ input: data, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { categories: ['create'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const category = await prisma.category.create({
      data: {
        nameRo: data.nameRo,
        nameRu: data.nameRu,
        descriptionRo: data.descriptionRo || null,
        descriptionRu: data.descriptionRu || null,
        slug: data.slug,
      },
    });

    return AdminCategoryBriefDtoFactory.fromEntity(category);
  });
