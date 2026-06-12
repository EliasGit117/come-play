import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { bannersAdminBase, bannersAdminPath } from './base';
import { deleteBannersByIdsSchema } from '@/features/banners/schemas/search-banners';
import { removeAllBannerImages } from '@/features/banners/services/banner-image-service';

interface IDeleteBannersResult {
  totalRequested: number;
  deletedCount: number;
  failedCount: number;
  imageDeletions: { bannerId: number; success: boolean; error?: string }[];
}

export const adminBannersDeleteMany = bannersAdminBase
  .route({
    method: 'POST',
    path: `${bannersAdminPath}/delete-many`,
    summary: 'Delete banners (bulk)',
    description: 'Deletes multiple banners, their images and reorders remaining',
  })
  .errors({ FORBIDDEN: {}, BAD_REQUEST: {}, CONFLICT: {} })
  .use(authMiddleware)
  .input(deleteBannersByIdsSchema)
  .output(type<IDeleteBannersResult>())
  .handler(async ({ input: { ids }, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { banners: ['delete'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const imageDeletionResults: IDeleteBannersResult['imageDeletions'] = [];

    const banners = await prisma.banner.findMany({
      where: { id: { in: ids } },
      orderBy: { order: 'asc' },
    });

    if (banners.length === 0)
      throw errors.BAD_REQUEST({ message: 'No banners found for given IDs.' });

    for (const banner of banners) {
      try {
        await removeAllBannerImages(banner.id);
        imageDeletionResults.push({ bannerId: banner.id, success: true });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        imageDeletionResults.push({ bannerId: banner.id, success: false, error: message });
      }
    }

    const failedBannerIds = imageDeletionResults
      .filter((r) => !r.success)
      .map((r) => r.bannerId);

    const successBannerIds = ids.filter((id) => !failedBannerIds.includes(id));

    let deletedCount = 0;
    if (successBannerIds.length > 0) {
      await prisma.$transaction(async (tx) => {
        const result = await tx.banner.deleteMany({ where: { id: { in: successBannerIds } } });
        deletedCount = result.count;

        const remaining = await tx.banner.findMany({ orderBy: { order: 'asc' } });

        for (let i = 0; i < remaining.length; i++) {
          await tx.banner.update({
            where: { id: remaining[i].id },
            data: { order: i + 1 },
          });
        }
      });
    }

    if (failedBannerIds.length > 0)
      throw errors.CONFLICT({
        message: `Failed to remove images for some banners. Deleted ${deletedCount} of ${ids.length}. Failures: ${failedBannerIds.join(', ')}`,
      });

    return {
      totalRequested: ids.length,
      deletedCount,
      failedCount: failedBannerIds.length,
      imageDeletions: imageDeletionResults,
    };
  });
