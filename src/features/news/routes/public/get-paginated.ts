import { type } from '@orpc/server';
import { NewsStatus, Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { newsPublicBase, newsPublicPath } from './base';
import { getNewsPaginatedSchema } from '@/features/news/schemas/search-news';
import { NewsBriefDtoFactory } from '@/features/news/dtos/news-brief-dto';
import { INewsDto } from '@/features/news/dtos/news-dto';
import { IPaginationResultWithCountDto, PaginationResultDtoFactory } from '@/features/common/pagination/pagination-result-dto';

export const getNewsPaginated = newsPublicBase
  .route({
    method: 'POST',
    path: `${newsPublicPath}/search`,
    summary: 'Search published news',
    description: 'Returns a paginated list of published news',
  })
  .meta({ anonymous: true })
  .input(getNewsPaginatedSchema)
  .output(type<IPaginationResultWithCountDto<INewsDto>>())
  .handler(async ({ input: data }) => {
    const where: Prisma.NewsWhereInput = {
      status: { equals: NewsStatus.published },
    };

    if (!!data.title)
      where.OR = [
        { titleRo: { contains: data.title, mode: 'insensitive' } },
        { titleRu: { contains: data.title, mode: 'insensitive' } },
      ];

    const [items, meta] = await prisma.news
      .paginate({
        orderBy: { [data.order ?? 'createdAt']: data.dir ?? 'desc' },
        where: where,
        include: { image: true },
      })
      .withPages({
        includePageCount: true,
        limit: data.limit ?? 10,
        page: data.page ?? 1,
      });

    return PaginationResultDtoFactory.getWithCount(NewsBriefDtoFactory.fromEntities(items), meta);
  });
