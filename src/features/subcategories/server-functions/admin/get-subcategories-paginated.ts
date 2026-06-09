import { z } from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { AdminSubcategoryBriefDtoFactory } from '@/features/subcategories/dtos/admin-subcategory-brief-dto';
import { paginatedSchema } from '@/features/common/pagination/pagination-validation';
import { dateRangeSchema, numberRangeSchema } from '@/components/data-table';
import { Prisma } from '@prisma/client';
import { PaginationResultDtoFactory } from '@/features/common/pagination/pagination-result-dto';

export const getSubcategoriesPaginatedForAdminSchema = paginatedSchema.extend({
  order: z.enum(['id', 'createdAt', 'updatedAt', 'slug', 'categoryId']).optional().catch(undefined),
  id: z.number().optional().catch(undefined),
  idRange: numberRangeSchema.optional().catch(undefined),
  name: z.string().optional().catch(undefined),
  slug: z.string().optional().catch(undefined),
  categoryId: z.number().optional().catch(undefined),
  categoryName: z.string().optional().catch(undefined),
  createdAt: dateRangeSchema.optional().catch(undefined),
  updatedAt: dateRangeSchema.optional().catch(undefined)
});

export type TGetSubcategoriesPaginatedForAdminSchema = z.infer<typeof getSubcategoriesPaginatedForAdminSchema>;

export const getSubcategoriesPaginatedForAdmin = createServerFn({ method: 'GET' })
  .inputValidator(getSubcategoriesPaginatedForAdminSchema)
  .handler(async ({ data }) => {
    const where: Prisma.SubcategoryWhereInput = {};

    if (data.categoryId)
      where.categoryId = data.categoryId;

    if (data.categoryName)
      where.category = {
        OR: [
          { nameRo: { contains: data.categoryName, mode: 'insensitive' } },
          { nameRu: { contains: data.categoryName, mode: 'insensitive' } }
        ]
      };

    if (data.name)
      where.OR = [
        { nameRo: { contains: data.name, mode: 'insensitive' } },
        { nameRu: { contains: data.name, mode: 'insensitive' } }
      ];

    if (data.slug)
      where.slug = { contains: data.slug, mode: 'insensitive' };

    const [items, meta] = await prisma.subcategory
      .paginate({
        where,
        orderBy: { [data.order ?? 'id']: data.dir ?? 'desc' },
        include: { category: true }
      })
      .withPages({
        includePageCount: true,
        limit: data.limit ?? 10,
        page: data.page ?? 1
      });

    return PaginationResultDtoFactory.getWithCount(
      AdminSubcategoryBriefDtoFactory.fromEntities(items),
      meta
    );
  });

export const getSubcategoriesPaginatedForAdminQueryOptions = (params: z.infer<typeof getSubcategoriesPaginatedForAdminSchema>) => ({
  queryKey: ['admin', 'subcategories', 'paginated', params],
  queryFn: () => getSubcategoriesPaginatedForAdmin({ data: params }),
  staleTime: 30_000,
  gcTime: 60_000
});