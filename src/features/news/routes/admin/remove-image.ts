import { z } from 'zod';
import { type } from '@orpc/server';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { newsAdminBase, newsAdminPath } from './base';
import { removeImageFromNews } from '@/features/news/services/news-image-service';

export const adminNewsRemoveImage = newsAdminBase
  .route({
    method: 'POST',
    path: `${newsAdminPath}/remove-image`,
    summary: 'Remove news image',
    description: 'Removes the image attached to a news entry',
  })
  .errors({ FORBIDDEN: {} })
  .use(authMiddleware)
  .input(z.object({ newsId: z.number() }))
  .output(type<void>())
  .handler(async ({ input, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { news: ['update'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    await removeImageFromNews(input.newsId);
  });
