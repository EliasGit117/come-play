import { type } from '@orpc/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { subcategoriesAdminBase, subcategoriesAdminPath } from './base';
import { getSubcategoriesPaginatedForAdminSchema } from '@/features/subcategories/schemas/search-subcategories';
import { AdminSubcategoryBriefDtoFactory, IAdminSubcategoryBriefDto } from '@/features/subcategories/dtos/admin-subcategory-brief-dto';
import { IPaginationResultWithCountDto, PaginationResultDtoFactory } from '@/features/common/pagination/pagination-result-dto';

export const adminSubcategoriesSearch = subcategoriesAdminBase
  .route({
    method: 'POST',
    path: `${subcategoriesAdminPath}/search`,
    summary: 'Search subcategories',
    description: 'Returns a paginated list of subcategories',
  })
  .errors({ FORBIDDEN: {} })
  .use(authMiddleware)
  .input(getSubcategoriesPaginatedForAdminSchema)
  .output(type<IPaginationResultWithCountDto<IAdminSubcategoryBriefDto>>())
  .handler(async ({ input: data, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { subcategories: ['list'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const where: Prisma.SubcategoryWhereInput = {};

    if (data.categoryId)
      where.categoryId = data.categoryId;

    if (data.categoryName)
      where.category = {
        OR: [
          { nameRo: { contains: data.categoryName, mode: 'insensitive' } },
          { nameRu: { contains: data.categoryName, mode: 'insensitive' } },
        ],
      };

    if (data.name)
      where.OR = [
        { nameRo: { contains: data.name, mode: 'insensitive' } },
        { nameRu: { contains: data.name, mode: 'insensitive' } },
      ];

    if (data.slug)
      where.slug = { contains: data.slug, mode: 'insensitive' };

    const [items, meta] = await prisma.subcategory
      .paginate({
        where,
        orderBy: { [data.order ?? 'id']: data.dir ?? 'desc' },
        include: { category: true },
      })
      .withPages({
        includePageCount: true,
        limit: data.limit ?? 10,
        page: data.page ?? 1,
      });

    return PaginationResultDtoFactory.getWithCount(
      AdminSubcategoryBriefDtoFactory.fromEntities(items),
      meta,
    );
  });
