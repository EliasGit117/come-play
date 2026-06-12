import { z } from 'zod';
import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { categoriesAdminBase, categoriesAdminPath } from './base';
import { AdminCategoryBriefDtoFactory, IAdminCategoryBriefDto } from '@/features/categories/dtos/admin-category-brief-dto';

export const adminCategoriesGetById = categoriesAdminBase
  .route({
    method: 'GET',
    path: `${categoriesAdminPath}/{id}`,
    summary: 'Get category by id',
    description: 'Returns a single category with its subcategories',
  })
  .errors({ FORBIDDEN: {}, NOT_FOUND: {} })
  .use(authMiddleware)
  .input(z.object({ id: z.number() }))
  .output(type<IAdminCategoryBriefDto>())
  .handler(async ({ input, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { categories: ['get'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const category = await prisma.category.findUnique({
      where: { id: input.id },
      include: { subcategories: true },
    });

    if (!category)
      throw errors.NOT_FOUND();

    return AdminCategoryBriefDtoFactory.fromEntity(category);
  });
