import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { bannersPublicBase } from './base';
import { BannerBriefDtoFactory, IBannerBriefDto } from '@/features/banners/dtos/banner-brief-dto';

export const getBanners = bannersPublicBase
  .route({
    method: 'GET',
    summary: 'Get active banners',
    description: 'Returns active banners ordered by their order',
  })
  .meta({ anonymous: true })
  .output(type<IBannerBriefDto[]>())
  .handler(async () => {
    const items = await prisma.banner.findMany({
      include: { desktopImage: true, tabletImage: true, mobileImage: true },
      orderBy: { order: 'asc' },
      where: { isActive: true },
    });

    return BannerBriefDtoFactory.fromEntities(items);
  });
