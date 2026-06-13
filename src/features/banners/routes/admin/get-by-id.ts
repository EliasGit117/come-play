import { z } from 'zod';
import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { bannersAdminBase, bannersAdminPath } from './base';
import { IAdminBannerDto, IAdminBannerDtoFactory } from '@/features/banners/dtos/admin-banner-dto';

export const adminBannersGetById = bannersAdminBase
  .route({
    method: 'GET',
    path: `${bannersAdminPath}/{id}`,
    summary: 'Get banner by id',
    description: 'Returns a single banner with its images',
  })
  .errors({ FORBIDDEN: {}, NOT_FOUND: {} })
  .use(authMiddleware)
  .input(z.object({ id: z.number() }))
  .output(type<IAdminBannerDto>())
  .handler(async ({ input, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { banners: ['get'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const banner = await prisma.banner.findUnique({
      where: { id: input.id },
      include: { desktopImage: true, tabletImage: true, mobileImage: true },
    });

    if (!banner)
      throw errors.NOT_FOUND({ message: 'Banner not found' });

    return IAdminBannerDtoFactory.fromEntity(banner);
  });
