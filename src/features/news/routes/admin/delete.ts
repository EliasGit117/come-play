import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { newsAdminBase, newsAdminPath } from './base';
import { deleteNewsByIdSchema } from '@/features/news/schemas/search-news';
import { removeImageFromNews } from '@/features/news/services/news-image-service';

export const adminNewsDelete = newsAdminBase
  .route({
    method: 'POST',
    path: `${newsAdminPath}/delete`,
    summary: 'Delete news',
    description: 'Deletes a single news entry and its image',
  })
  .errors({ FORBIDDEN: {} })
  .use(authMiddleware)
  .input(deleteNewsByIdSchema)
  .output(type<void>())
  .handler(async ({ input: { id }, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { news: ['delete'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const existingImage = await prisma.newsImage.findUnique({ where: { newsId: id } });
    if (existingImage)
      await removeImageFromNews(id);

    await prisma.news.delete({ where: { id } });
  });
