import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { newsAdminBase } from './base';
import { createNewsSchema } from '@/features/news/schemas/create-news';
import { IAdminNewsDto, IAdminNewsDtoFactory } from '@/features/news/dtos/admin-news-dto';

export const adminNewsCreate = newsAdminBase
  .route({
    method: 'POST',
    summary: 'Create news',
    description: 'Creates a new news entry',
  })
  .errors({ FORBIDDEN: {}, CONFLICT: {} })
  .use(authMiddleware)
  .input(createNewsSchema)
  .output(type<IAdminNewsDto>())
  .handler(async ({ input: data, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { news: ['create'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const withSameSlug = await prisma.news.findFirst({ where: { slug: data.slug } });

    if (withSameSlug)
      throw errors.CONFLICT({ message: 'There is already a news with such a slug' });

    const news = await prisma.news.create({
      data: {
        slug: data.slug,
        titleRo: data.titleRo,
        titleRu: data.titleRu,
        contentRo: null,
        contentRu: null,
      },
    });

    return IAdminNewsDtoFactory.fromEntity(news);
  });
