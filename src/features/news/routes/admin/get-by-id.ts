import { z } from 'zod';
import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { newsAdminBase, newsAdminPath } from './base';
import { IAdminNewsDto, IAdminNewsDtoFactory } from '@/features/news/dtos/admin-news-dto';

export const adminNewsGetById = newsAdminBase
  .route({
    method: 'GET',
    path: `${newsAdminPath}/{id}`,
    summary: 'Get news by id',
    description: 'Returns a single news with its image',
  })
  .errors({ FORBIDDEN: {}, NOT_FOUND: {} })
  .use(authMiddleware)
  .input(z.object({ id: z.number() }))
  .output(type<IAdminNewsDto>())
  .handler(async ({ input, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { news: ['get'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const news = await prisma.news.findUnique({
      where: { id: input.id },
      include: { image: true },
    });

    if (!news)
      throw errors.NOT_FOUND();

    return IAdminNewsDtoFactory.fromEntity(news);
  });
