import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { AdminCategoryBriefDtoFactory } from '@/features/categories/dtos/admin-category-brief-dto';
import { paginatedSchema } from '@/features/common/pagination/pagination-validation';
import { dateRangeSchema, numberRangeSchema } from '@/components/data-table';
import { Prisma } from '@prisma/client';
import { PaginationResultDtoFactory } from '@/features/common/pagination/pagination-result-dto';


export const getCategoriesPaginatedForAdminSchema = paginatedSchema.extend({
  limit: z.number().int().min(1).max(10000).optional().catch(10),
  order: z.enum(['id', 'createdAt', 'updatedAt', 'slug']).optional().catch(undefined),
  id: z.number().int().optional().catch(undefined),
  idRange: numberRangeSchema.optional().catch(undefined),
  name: z.string().optional().catch(undefined),
  slug: z.string().optional().catch(undefined),
  createdAt: dateRangeSchema.optional().catch(undefined),
  updatedAt: dateRangeSchema.optional().catch(undefined),
});

export type TGetCategoriesPaginatedParamsForAdmin = z.infer<typeof getCategoriesPaginatedForAdminSchema>;


export const getCategoriesPaginatedForAdmin = createServerFn({ method: 'GET' })
  .inputValidator(getCategoriesPaginatedForAdminSchema)
  .handler(async ({ data }) => {
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
        { nameRu: { contains: data.name, mode: 'insensitive' } }
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
              subcategories: true
            }
          }
        }
      })
      .withPages({
        includePageCount: true,
        limit: data.limit ?? 10,
        page: data.page ?? 1
      });

    return PaginationResultDtoFactory.getWithCount(AdminCategoryBriefDtoFactory.fromEntities(items), meta);
  });


export const getCategoriesPaginatedForAdminQueryOptions = (
  params: TGetCategoriesPaginatedParamsForAdmin
) => ({
  queryKey: ['admin', 'categories', 'paginated', params],
  queryFn: () => getCategoriesPaginatedForAdmin({ data: params }),
  staleTime: 30_000,
  gcTime: 60_000
});