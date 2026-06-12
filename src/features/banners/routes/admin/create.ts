import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { bannersAdminBase } from './base';
import { createBannerSchema } from '@/features/banners/schemas/create-banner';
import { IAdminBannerDto, IAdminBannerDtoFactory } from '@/features/banners/dtos/admin-banner-dto';

export const adminBannersCreate = bannersAdminBase
  .route({
    method: 'POST',
    summary: 'Create banner',
    description: 'Creates a new banner',
  })
  .errors({ FORBIDDEN: {} })
  .use(authMiddleware)
  .input(createBannerSchema)
  .output(type<IAdminBannerDto>())
  .handler(async ({ input: data, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { banners: ['create'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const banner = await prisma.$transaction(async (tx) => {
      const maxOrder = await tx.banner.aggregate({ _max: { order: true } });

      return tx.banner.create({
        data: {
          title: data.title,
          titleRo: data.titleRo || null,
          titleRu: data.titleRu || null,
          textRo: data.textRo || null,
          textRu: data.textRu || null,
          path: data.path || null,
          order: (maxOrder._max.order ?? 0) + 1,
          isActive: data.isActive,
        },
      });
    });

    return IAdminBannerDtoFactory.fromEntity(banner);
  });
