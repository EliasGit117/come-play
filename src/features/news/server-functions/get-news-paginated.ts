import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { paginatedSchema } from '@/features/common/pagination/pagination-validation';
import { PaginationResultWithCountDto } from '@/features/common/pagination/pagination-result-dto';
import z from 'zod';
import { queryOptions } from '@tanstack/react-query';
import { NewsBriefDto } from '@/features/news/dtos/news-brief-dto';


export const getNewsPaginatedSchema = paginatedSchema.extend({});
export type TGetNewsPaginatedParams = z.infer<typeof getNewsPaginatedSchema>;

export const getNewsPaginated = createServerFn({ method: 'GET' })
  .validator(getNewsPaginatedSchema)
  .handler(async ({ data: { page, limit } }) => {
    const [items, meta] = await prisma.news
      .paginate()
      .withPages({
        includePageCount: true,
        limit: limit,
        page: page,
      });

    const dtos = items.map(news => NewsBriefDto.fromEntity(news));
    return PaginationResultWithCountDto.fromPrismaPaginationRes(dtos, meta);
  });


export function getNewsPaginatedQueryOptions(params: TGetNewsPaginatedParams) {
  return queryOptions({
    queryKey: ['news', params],
    queryFn: () => getNewsPaginated({ data: params }),
    staleTime: 30_000,
    gcTime: 30_000
  })
}
