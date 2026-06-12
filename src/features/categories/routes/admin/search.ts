import { type } from '@orpc/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { categoriesAdminBase, categoriesAdminPath } from './base';
import { getCategoriesPaginatedForAdminSchema } from '@/features/categories/schemas/search-categories';
import { AdminCategoryBriefDtoFactory, IAdminCategoryBriefDto } from '@/features/categories/dtos/admin-category-brief-dto';
import { IPaginationResultWithCountDto, PaginationResultDtoFactory } from '@/features/common/pagination/pagination-result-dto';

export const adminCategoriesSearch = categoriesAdminBase
  .route({
    method: 'POST',
    path: `${categoriesAdminPath}/search`,
    summary: 'Search categories',
    description: 'Returns a paginated list of categories',
  })
  .errors({ FORBIDDEN: {} })
  .use(authMiddleware)
  .input(getCategoriesPaginatedForAdminSchema)
  .output(type<IPaginationResultWithCountDto<IAdminCategoryBriefDto>>())
  .handler(async ({ input: data, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { categories: ['list'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const where: Prisma.CategoryWhereInput = {};

    if (data.id)
      where.id = { equals: data.id };

    if (data.idRange) {
      const [minId, maxId] = data.idRange;
      where.id = {};

      if (minId !== null)
        where.id.gte = minId;

      if (maxId !== null)
        where.id.lte = maxId;
    }

    if (!!data.name)
      where.OR = [
        { nameRo: { contains: data.name, mode: 'insensitive' } },
        { nameRu: { contains: data.name, mode: 'insensitive' } },
      ];

    if (!!data.slug)
      where.slug = { contains: data.slug, mode: 'insensitive' };

    if (data.createdAt?.from || data.createdAt?.to) {
      where.createdAt = {};
      if (data.createdAt.from) where.createdAt.gte = data.createdAt.from;
      if (data.createdAt.to) where.createdAt.lte = data.createdAt.to;
    }

    if (data.updatedAt?.from || data.updatedAt?.to) {
      where.updatedAt = {};
      if (data.updatedAt.from) where.updatedAt.gte = data.updatedAt.from;
      if (data.updatedAt.to) where.updatedAt.lte = data.updatedAt.to;
    }

    const [items, meta] = await prisma.category
      .paginate({
        orderBy: { [data.order ?? 'id']: data.dir ?? 'desc' },
        where: where,
        include: {
          _count: {
            select: {
              subcategories: true,
            },
          },
        },
      })
      .withPages({
        includePageCount: true,
        limit: data.limit ?? 10,
        page: data.page ?? 1,
      });

    return PaginationResultDtoFactory.getWithCount(AdminCategoryBriefDtoFactory.fromEntities(items), meta);
  });
