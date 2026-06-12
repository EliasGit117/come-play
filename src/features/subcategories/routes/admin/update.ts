import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { subcategoriesAdminBase } from './base';
import { editSubcategorySchema } from '@/features/subcategories/schemas/edit-subcategory';
import { AdminSubcategoryBriefDtoFactory, IAdminSubcategoryBriefDto } from '@/features/subcategories/dtos/admin-subcategory-brief-dto';

export const adminSubcategoriesUpdate = subcategoriesAdminBase
  .route({
    method: 'PUT',
    summary: 'Update subcategory',
    description: 'Updates an existing subcategory',
  })
  .errors({ FORBIDDEN: {}, NOT_FOUND: {}, CONFLICT: {} })
  .use(authMiddleware)
  .input(editSubcategorySchema)
  .output(type<IAdminSubcategoryBriefDto>())
  .handler(async ({ input: data, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { subcategories: ['update'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const { id } = data;

    const existing = await prisma.subcategory.findUnique({ where: { id } });
    if (!existing)
      throw errors.NOT_FOUND({ message: 'Subcategory not found' });

    const withSameSlug = await prisma.subcategory.findFirst({
      where: {
        NOT: { id },
        slug: data.slug,
        categoryId: data.categoryId ?? null,
      },
    });

    if (withSameSlug)
      throw errors.CONFLICT({
        message: data.categoryId
          ? 'A subcategory with this slug already exists in the selected category.'
          : 'A subcategory with this slug already exists without a category.',
      });

    const updated = await prisma.subcategory.update({
      where: { id },
      data: {
        slug: data.slug,
        nameRo: data.nameRo,
        nameRu: data.nameRu,
        descriptionRo: data.descriptionRo,
        descriptionRu: data.descriptionRu,
        categoryId: data.categoryId ?? null,
      },
      include: { category: true },
    });

    return AdminSubcategoryBriefDtoFactory.fromEntity(updated);
  });
