import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { newsAdminBase, newsAdminPath } from './base';
import { deleteNewsByIdsSchema } from '@/features/news/schemas/search-news';
import { removeImageFromNews } from '@/features/news/services/news-image-service';

interface IDeleteNewsManyResult {
  totalReceived: number;
  newsDeletedCount: number;
  imageDeletions: { newsId: number; success: boolean; error?: string }[];
}

export const adminNewsDeleteMany = newsAdminBase
  .route({
    method: 'POST',
    path: `${newsAdminPath}/delete-many`,
    summary: 'Delete news (bulk)',
    description: 'Deletes multiple news entries and their images',
  })
  .errors({ FORBIDDEN: {}, CONFLICT: {} })
  .use(authMiddleware)
  .input(deleteNewsByIdsSchema)
  .output(type<IDeleteNewsManyResult>())
  .handler(async ({ input: { ids }, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { news: ['delete'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const imageDeletionResults: IDeleteNewsManyResult['imageDeletions'] = [];

    const relatedImages = await prisma.newsImage.findMany({
      where: { newsId: { in: ids } },
    });

    for (const img of relatedImages) {
      try {
        await removeImageFromNews(img.newsId);
        imageDeletionResults.push({ newsId: img.newsId, success: true });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        imageDeletionResults.push({ newsId: img.newsId, success: false, error: message });
      }
    }

    const failedImageIds = imageDeletionResults
      .filter((r) => !r.success)
      .map((r) => r.newsId);

    const deletableNewsIds = ids.filter((id) => !failedImageIds.includes(id));

    let deletedCount = 0;
    if (deletableNewsIds.length > 0) {
      await prisma.$transaction(async (tx) => {
        const result = await tx.news.deleteMany({
          where: { id: { in: deletableNewsIds } },
        });
        deletedCount = result.count;
      });
    }

    if (failedImageIds.length > 0)
      throw errors.CONFLICT({
        message: `Some images could not be deleted. Deleted ${deletedCount} of ${ids.length} news. Failed in: ${failedImageIds.join(', ')}`,
      });

    return {
      totalReceived: ids.length,
      newsDeletedCount: deletedCount,
      imageDeletions: imageDeletionResults,
    };
  });
