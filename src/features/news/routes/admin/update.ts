import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { newsAdminBase } from './base';
import { editNewsSchema } from '@/features/news/schemas/edit-news';
import { IAdminNewsDto, IAdminNewsDtoFactory } from '@/features/news/dtos/admin-news-dto';

export const adminNewsUpdate = newsAdminBase
  .route({
    method: 'PUT',
    summary: 'Update news',
    description: 'Updates an existing news entry',
  })
  .errors({ FORBIDDEN: {} })
  .use(authMiddleware)
  .input(editNewsSchema)
  .output(type<IAdminNewsDto>())
  .handler(async ({ input: data, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { news: ['update'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const res = await prisma.news.update({
      where: { id: data.id },
      data: {
        slug: data.slug,
        titleRo: data.titleRo,
        titleRu: data.titleRu,
        contentRo: data.contentRo,
        contentRu: data.contentRu,
        status: data.status,
      },
    });

    return IAdminNewsDtoFactory.fromEntity(res);
  });
