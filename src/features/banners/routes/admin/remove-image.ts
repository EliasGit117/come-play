import { z } from 'zod';
import { type } from '@orpc/server';
import { BannerImageType } from '@prisma/client';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { bannersAdminBase, bannersAdminPath } from './base';
import { removeBannerImage } from '@/features/banners/services/banner-image-service';

export const adminBannersRemoveImage = bannersAdminBase
  .route({
    method: 'POST',
    path: `${bannersAdminPath}/remove-image`,
    summary: 'Remove banner image',
    description: 'Removes a banner image of the given type',
  })
  .errors({ FORBIDDEN: {} })
  .use(authMiddleware)
  .input(z.object({ bannerId: z.number(), imageType: z.nativeEnum(BannerImageType) }))
  .output(type<void>())
  .handler(async ({ input, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { banners: ['update'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    await removeBannerImage(input.bannerId, input.imageType);
  });
