import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { paginatedSchema } from '@/features/common/pagination/pagination-validation';
import z from 'zod';
import { queryOptions } from '@tanstack/react-query';
import { AdminNewsBriefDtoFactory } from '@/features/news/dtos/admin-news-brief-dto';
import { NewsStatus, Prisma } from '@prisma/client';
import { PaginationResultDtoFactory } from '@/features/common/pagination/pagination-result-dto';
import { dateRangeSchema, numberRangeSchema } from '@/components/data-table';


export const getNewsPaginatedSchema = paginatedSchema.extend({
  order: z.enum(['id', 'createdAt', 'updatedAt', 'title', 'slug', 'status']).optional().catch(undefined),
  id: z.number().int().optional().catch(undefined),
  idRange: numberRangeSchema.optional().catch(undefined),
  title: z.string().optional().catch(undefined),
  slug: z.string().optional().catch(undefined),
  status: z.union([z.nativeEnum(NewsStatus), z.array(z.nativeEnum(NewsStatus))])
    .optional()
    .catch(undefined),
  createdAt: dateRangeSchema.optional().catch(undefined),
  updatedAt: dateRangeSchema.optional().catch(undefined)
});

export type TGetNewsPaginatedParams = z.infer<typeof getNewsPaginatedSchema>;

export const getNewsPaginated = createServerFn({ method: 'GET' })
  .inputValidator(getNewsPaginatedSchema)
  .handler(async ({ data }) => {
    const where: Prisma.NewsWhereInput = {};

    if (data.id) {
      where.id = { equals: data.id };
    }

    if (data.idRange) {
      const [minId, maxId] = data.idRange;
      where.id = {};

      if (minId !== null)
        where.id.gte = minId;

      if (maxId !== null)
        where.id.lte = maxId;
    }

    if (!!data.title)
      where.OR = [
        { titleRo: { contains: data.title, mode: 'insensitive' } },
        { titleRu: { contains: data.title, mode: 'insensitive' } }
      ];

    if (!!data.slug)
      where.slug = { contains: data.slug, mode: 'insensitive' };

    if (!!data.status) {
      if (Array.isArray(data.status))
        where.status = { in: data.status };
      else
        where.status = { equals: data.status };
    }

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


    const [items, meta] = await prisma.news
      .paginate({
        orderBy: { [data.order ?? 'id']: data.dir ?? 'desc' },
        where
      })
      .withPages({
        includePageCount: true,
        limit: data.limit ?? 10,
        page: data.page ?? 1
      });

    return PaginationResultDtoFactory.getWithCount(AdminNewsBriefDtoFactory.fromEntities(items), meta);
  });


export function getNewsPaginatedQueryOptions(params: TGetNewsPaginatedParams) {
  return queryOptions({
    queryKey: ['news', 'paginated', params],
    queryFn: () => getNewsPaginated({ data: params }),
    staleTime: 30_000,
    gcTime: 30_000
  });
}
