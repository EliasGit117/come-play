import { z } from 'zod';
import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { subcategoriesAdminBase, subcategoriesAdminPath } from './base';
import { AdminSubcategoryBriefDtoFactory, IAdminSubcategoryBriefDto } from '@/features/subcategories/dtos/admin-subcategory-brief-dto';

export const adminSubcategoriesGetById = subcategoriesAdminBase
  .route({
    method: 'GET',
    path: `${subcategoriesAdminPath}/{id}`,
    summary: 'Get subcategory by id',
    description: 'Returns a single subcategory',
  })
  .errors({ FORBIDDEN: {}, NOT_FOUND: {} })
  .use(authMiddleware)
  .input(z.object({ id: z.number() }))
  .output(type<IAdminSubcategoryBriefDto>())
  .handler(async ({ input, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { subcategories: ['get'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const subcategory = await prisma.subcategory.findUnique({
      where: { id: input.id },
      include: { category: true, products: true },
    });

    if (!subcategory)
      throw errors.NOT_FOUND();

    return AdminSubcategoryBriefDtoFactory.fromEntity(subcategory);
  });
