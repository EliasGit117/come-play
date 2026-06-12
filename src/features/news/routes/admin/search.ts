import { type } from '@orpc/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { hasValue } from '@/lib/has-value';
import { newsAdminBase, newsAdminPath } from './base';
import { getNewsPaginatedForAdminSchema } from '@/features/news/schemas/search-news';
import { AdminNewsBriefDtoFactory, IAdminNewsBriefDto } from '@/features/news/dtos/admin-news-brief-dto';
import { IPaginationResultWithCountDto, PaginationResultDtoFactory } from '@/features/common/pagination/pagination-result-dto';

export const adminNewsSearch = newsAdminBase
  .route({
    method: 'POST',
    path: `${newsAdminPath}/search`,
    summary: 'Search news',
    description: 'Returns a paginated list of news',
  })
  .errors({ FORBIDDEN: {} })
  .use(authMiddleware)
  .input(getNewsPaginatedForAdminSchema)
  .output(type<IPaginationResultWithCountDto<IAdminNewsBriefDto>>())
  .handler(async ({ input: data, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { news: ['list'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const where: Prisma.NewsWhereInput = {};

    if (hasValue(data.hasImage))
      where.image = data.hasImage ? { isNot: null } : { is: null };

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

    if (!!data.title)
      where.OR = [
        { titleRo: { contains: data.title, mode: 'insensitive' } },
        { titleRu: { contains: data.title, mode: 'insensitive' } },
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
        include: { image: true },
        orderBy: { [data.order ?? 'id']: data.dir ?? 'desc' },
        where,
      })
      .withPages({
        includePageCount: true,
        limit: data.limit ?? 10,
        page: data.page ?? 1,
      });

    return PaginationResultDtoFactory.getWithCount(AdminNewsBriefDtoFactory.fromEntities(items), meta);
  });
