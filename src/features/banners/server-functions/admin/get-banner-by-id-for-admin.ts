import { z } from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { queryOptions } from '@tanstack/react-query';
import { IAdminBannerDtoFactory } from '@/features/banners/dtos/admin-banner-dto';

export const getBannerByIdForAdminSchema = z.object({ id: z.number() });

export type TGetBannerByIdForAdminSchema = z.infer<typeof getBannerByIdForAdminSchema>;

export const getBannerByIdForAdmin = createServerFn({ method: 'GET' })
  .inputValidator(getBannerByIdForAdminSchema)
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

export function getBannerByIdForAdminQueryOptions(id: number | string) {
  const parsedId = typeof id === "string" ? z.coerce.number().parse(id) : id;

  return queryOptions({
    queryKey: ['banners', id],
    queryFn: () => getBannerByIdForAdmin({ data: { id: parsedId } }),
    staleTime: 10_000
  });
}