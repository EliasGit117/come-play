import { z } from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { queryOptions } from '@tanstack/react-query';
import { IAdminBannerDtoFactory } from '@/features/banners/dtos/admin-banner-dto';

export const getBannerByIdSchema = z.object({ id: z.number() });

export type TGetBannerByIdParams = z.infer<typeof getBannerByIdSchema>;

export const getBannerById = createServerFn({ method: 'GET' })
  .inputValidator(getBannerByIdSchema)
  .handler(async ({ data: { id } }) => {
    const banner = await prisma.banner.findUnique({
      where: { id },
      include: {
        desktopImage: true,
        tabletImage: true,
        mobileImage: true
      }
    });

    if (!banner)
      throw new Error('Banner not found');

    return IAdminBannerDtoFactory.fromEntity(banner);
  });

export function getBannerByIdQueryOptions(id: number | string) {
  const parsedId = typeof id === "string" ? z.coerce.number().parse(id) : id;

  return queryOptions({
    queryKey: ['banners', id],
    queryFn: () => getBannerById({ data: { id: parsedId } }),
    staleTime: 10_000
  });
}