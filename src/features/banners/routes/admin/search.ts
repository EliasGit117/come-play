import { type } from '@orpc/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { hasValue } from '@/lib/has-value';
import { bannersAdminBase, bannersAdminPath } from './base';
import { getBannersForAdminSchema } from '@/features/banners/schemas/search-banners';
import { AdminBannerBriefDtoFactory, IAdminBannerBriefDto } from '@/features/banners/dtos/admin-banner-brief-dto';

export const adminBannersSearch = bannersAdminBase
  .route({
    method: 'POST',
    path: `${bannersAdminPath}/search`,
    summary: 'Search banners',
    description: 'Returns a list of banners',
  })
  .errors({ FORBIDDEN: {} })
  .use(authMiddleware)
  .input(getBannersForAdminSchema)
  .output(type<IAdminBannerBriefDto[]>())
  .handler(async ({ input: data, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { banners: ['list'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const where: Prisma.BannerWhereInput = {};

    if (hasValue(data.images)) {
      if (data.images?.includes('desktop')) where.desktopImage = { isNot: null };
      if (data.images?.includes('tablet')) where.tabletImage = { isNot: null };
      if (data.images?.includes('mobile')) where.mobileImage = { isNot: null };
    }

    if (data.id) where.id = { equals: data.id };

    if (data.idRange) {
      const [minId, maxId] = data.idRange;
      where.id = {};
      if (minId !== null) where.id.gte = minId;
      if (maxId !== null) where.id.lte = maxId;
    }

    if (!!data.title)
      where.OR = [{ title: { contains: data.title, mode: 'insensitive' } }];

    if (!!data.path)
      where.path = { contains: data.path, mode: 'insensitive' };

    if (hasValue(data.isActive))
      where.isActive = { equals: data.isActive };

    if (data.createdAt?.from || data.createdAt?.to) {
      where.createdAt = {};
      if (data.createdAt.from) where.createdAt.gte = data.createdAt.from;
      if (data.createdAt.to) where.createdAt.lte = data.createdAt.to;
    }

    if (data.updatedAt?.from || data.updatedAt?.to) {
      where.updatedAt = {};
      if (data.updatedAt.from) where.updatedAt.gte = data.updatedAt.from;
      if (data.updatedAt.to) where.updatedAt.lte = data.updatedAt.to;
    }

    const items = await prisma.banner.findMany({
      include: { desktopImage: true, tabletImage: true, mobileImage: true },
      orderBy: { [data.order ?? 'order']: data.dir ?? 'asc' },
      where: where,
    });

    return AdminBannerBriefDtoFactory.fromEntities(items);
  });
