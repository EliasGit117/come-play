import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { queryOptions } from '@tanstack/react-query';
import { Prisma } from '@prisma/client';
import { BannerDtoFactory } from '@/features/banners/dtos/banner-dto';


export const getBannersSchema = z.object({});

export type TGetBannersSchema = z.infer<typeof getBannersSchema>;

export const getBanners = createServerFn({ method: 'GET' })
  .inputValidator(getBannersSchema)
  .handler(async ({}) => {
    const where: Prisma.BannerWhereInput = {};

    const items = await prisma.banner.findMany({
      include: {
        desktopImage: true,
        tabletImage: true,
        mobileImage: true
      },
      orderBy: { order: 'asc' },
      where: where
    });

    return BannerDtoFactory.fromEntities(items);
  });

export function getBannersQueryOptions(params?: TGetBannersSchema) {
  const paramsObj = params || {};

  return queryOptions({
    queryKey: ['banners', paramsObj],
    queryFn: () => getBanners({ data: paramsObj }),
    staleTime: 10_000,
    gcTime: 10_000
  });
}