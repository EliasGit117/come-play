import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { subcategoriesAdminBase } from './base';
import { createSubcategorySchema } from '@/features/subcategories/schemas/create-subcategory';
import { AdminSubcategoryBriefDtoFactory, IAdminSubcategoryBriefDto } from '@/features/subcategories/dtos/admin-subcategory-brief-dto';

export const adminSubcategoriesCreate = subcategoriesAdminBase
  .route({
    method: 'POST',
    summary: 'Create subcategory',
    description: 'Creates a new subcategory',
  })
  .errors({ FORBIDDEN: {}, CONFLICT: {} })
  .use(authMiddleware)
  .input(createSubcategorySchema)
  .output(type<IAdminSubcategoryBriefDto>())
  .handler(async ({ input: data, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { subcategories: ['create'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const existing = await prisma.subcategory.findFirst({
      where: {
        slug: data.slug,
        categoryId: data.categoryId ?? null,
      },
    });

    if (existing)
      throw errors.CONFLICT({
        message: data.categoryId
          ? 'A subcategory with this slug already exists in the selected category.'
          : 'A subcategory with this slug already exists without a category.',
      });

    const subcategory = await prisma.subcategory.create({
      data,
      include: { category: true },
    });

    return AdminSubcategoryBriefDtoFactory.fromEntity(subcategory);
  });
