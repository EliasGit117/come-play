import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { paginatedSchema } from '@/features/common/pagination/pagination-validation';
import z from 'zod';
import { queryOptions } from '@tanstack/react-query';
import { NewsStatus, Prisma } from '@prisma/client';
import { PaginationResultDtoFactory } from '@/features/common/pagination/pagination-result-dto';
import { NewsBriefDtoFactory } from '@/features/news/dtos/news-brief-dto';


export const getNewsPaginatedSchema = paginatedSchema.extend({
  order: z.enum(['id', 'createdAt', 'updatedAt', 'title', 'slug', 'status']).optional().catch(undefined),
  title: z.string().optional().catch(undefined),
});

export type TGetNewsPaginatedParams = z.infer<typeof getNewsPaginatedSchema>;

export const getNewsPaginated = createServerFn({ method: 'GET' })
  .inputValidator(getNewsPaginatedSchema)
  .handler(async ({ data }) => {
    const where: Prisma.NewsWhereInput = {
      status: { equals: NewsStatus.published }
    };

    if (!!data.title)
      where.OR = [
        { titleRo: { contains: data.title, mode: 'insensitive' } },
        { titleRu: { contains: data.title, mode: 'insensitive' } }
      ];

    const [items, meta] = await prisma.news
      .paginate({
        orderBy: { [data.order ?? 'createdAt']: data.dir ?? 'desc' },
        where: where,
        include: {
          image: true
        }
      })
      .withPages({
        includePageCount: true,
        limit: data.limit ?? 10,
        page: data.page ?? 1
      });

    return PaginationResultDtoFactory.getWithCount(NewsBriefDtoFactory.fromEntities(items), meta);
  });


export function getNewsPaginatedQueryOptions(params: TGetNewsPaginatedParams) {
  return queryOptions({
    queryKey: ['news', 'paginated', params],
    queryFn: () => getNewsPaginated({ data: params }),
    staleTime: 30_000,
    gcTime: 30_000
  });
}
