import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { bannersAdminBase } from './base';
import { editBannerSchema } from '@/features/banners/schemas/edit-banner';
import { IAdminBannerDto, IAdminBannerDtoFactory } from '@/features/banners/dtos/admin-banner-dto';

export const adminBannersUpdate = bannersAdminBase
  .route({
    method: 'PUT',
    summary: 'Update banner',
    description: 'Updates an existing banner',
  })
  .errors({ FORBIDDEN: {} })
  .use(authMiddleware)
  .input(editBannerSchema)
  .output(type<IAdminBannerDto>())
  .handler(async ({ input: data, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { banners: ['update'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const { id, ...updateData } = data;

    const res = await prisma.banner.update({
      where: { id },
      data: {
        ...updateData,
        path: updateData.path || null,
      },
    });

    return IAdminBannerDtoFactory.fromEntity(res);
  });
