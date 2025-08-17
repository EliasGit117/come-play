import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { paginatedSchema } from '@/features/common/pagination/pagination-validation';
import { PaginationResultWithCountDto } from '@/features/common/pagination/pagination-result-dto';
import z from 'zod';
import { queryOptions } from '@tanstack/react-query';
import { NewsBriefDto } from '@/features/news/dtos/news-brief-dto';
import { Prisma } from '@prisma/client';


export const getNewsPaginatedSchema = paginatedSchema.extend({
  orderBy: z.enum(['createdAt', 'title', 'link']).optional().catch(undefined),
  idRange: z.tuple([z.number().nullable(), z.number().nullable()]).optional().catch(undefined),
  title: z.string().optional().catch(undefined),
  link: z.string().optional().catch(undefined),
});

export type TGetNewsPaginatedParams = z.infer<typeof getNewsPaginatedSchema>;

export const getNewsPaginated = createServerFn({ method: 'GET' })
  .validator(getNewsPaginatedSchema)
  .handler(async ({ data }) => {
    const { page, limit, orderBy = 'id', direction = 'desc', title, link, idRange } = data;

    const where: Prisma.NewsWhereInput = {};

    if (idRange) {
      const [minId, maxId] = idRange;
      where.id = {};

      if (minId !== null)
        where.id.gte = minId;

      if (maxId !== null)
        where.id.lte = maxId;
    }

    if (!!title)
      where.OR = [
        { titleRo: { contains: title, mode: 'insensitive' } },
        { titleRu: { contains: title, mode: 'insensitive' } },
      ]

    if (!!link)
      where.link = { contains: link, mode: 'insensitive' };


    const [items, meta] = await prisma.news
      .paginate({
        orderBy: { [orderBy]: direction },
        where: where
      })
      .withPages({
        includePageCount: true,
        limit: limit ?? 10,
        page: page ?? 1,
      });


    const dtos = items.map(news => NewsBriefDto.fromEntity(news));
    return PaginationResultWithCountDto.fromPrismaPaginationRes(dtos, meta);
  });


export function getNewsPaginatedQueryOptions(params: TGetNewsPaginatedParams) {
  return queryOptions({
    queryKey: ['news', 'paginated', params],
    queryFn: () => getNewsPaginated({ data: params }),
    staleTime: 30_000,
    gcTime: 30_000
  })
}
