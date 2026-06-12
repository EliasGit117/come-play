import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { bannersAdminBase, bannersAdminPath } from './base';
import { reorderBannersSchema } from '@/features/banners/schemas/search-banners';

export const adminBannersReorder = bannersAdminBase
  .route({
    method: 'POST',
    path: `${bannersAdminPath}/reorder`,
    summary: 'Reorder banners',
    description: 'Updates the order of banners',
  })
  .errors({ FORBIDDEN: {}, BAD_REQUEST: {} })
  .use(authMiddleware)
  .input(reorderBannersSchema)
  .output(type<{ success: boolean }>())
  .handler(async ({ input: { bannerIds }, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { banners: ['update'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    if (bannerIds.length === 0)
      throw errors.BAD_REQUEST({ message: 'No banners provided for reordering' });

    const uniqueIds = new Set(bannerIds);
    if (uniqueIds.size !== bannerIds.length)
      throw errors.BAD_REQUEST({ message: 'Duplicate banner IDs are not allowed' });

    const existingBanners = await prisma.banner.findMany({
      select: { id: true },
      orderBy: { order: 'asc' },
    });

    if (existingBanners.length !== bannerIds.length)
      throw errors.BAD_REQUEST({ message: `Banner count mismatch — expected ${existingBanners.length}, got ${bannerIds.length}` });

    const existingIds = new Set(existingBanners.map((b) => b.id));
    const invalidIds = bannerIds.filter((id) => !existingIds.has(id));

    if (invalidIds.length > 0)
      throw errors.BAD_REQUEST({ message: `Invalid banner IDs: ${invalidIds.join(', ')}` });

    await prisma.$transaction(
      bannerIds.map((id, index) =>
        prisma.banner.update({
          where: { id },
          data: { order: index + 1 },
        }),
      ),
    );

    return { success: true };
  });
