import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { bannersAdminBase, bannersAdminPath } from './base';
import { deleteBannerByIdSchema } from '@/features/banners/schemas/search-banners';
import { removeAllBannerImages } from '@/features/banners/services/banner-image-service';

export const adminBannersDelete = bannersAdminBase
  .route({
    method: 'POST',
    path: `${bannersAdminPath}/delete`,
    summary: 'Delete banner',
    description: 'Deletes a banner, its images and reorders remaining banners',
  })
  .errors({ FORBIDDEN: {}, NOT_FOUND: {} })
  .use(authMiddleware)
  .input(deleteBannerByIdSchema)
  .output(type<{ success: boolean }>())
  .handler(async ({ input: data, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { banners: ['delete'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const banner = await prisma.banner.findUnique({ where: { id: data.id } });
    if (!banner)
      throw errors.NOT_FOUND({ message: 'Banner not found' });

    await prisma.$transaction(async (tx) => {
      await removeAllBannerImages(data.id);
      await tx.banner.delete({ where: { id: data.id } });

      const bannersToUpdate = await tx.banner.findMany({
        where: { order: { gt: banner.order } },
        orderBy: { order: 'asc' },
      });

      for (const bannerToUpdate of bannersToUpdate) {
        await tx.banner.update({
          where: { id: bannerToUpdate.id },
          data: { order: bannerToUpdate.order - 1 },
        });
      }
    });

    return { success: true };
  });
