import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { queryOptions } from '@tanstack/react-query';
import { Prisma } from '@prisma/client';
import { dateRangeSchema, numberRangeSchema } from '@/components/data-table';
import { hasValue } from '@/utils/has-value';
import { AdminBannerBriefDtoFactory } from '@/features/banners/dtos/admin-banner-brief-dto';


export const getBannersForAdminSchema = z.object({
  order: z.enum(['id', 'createdAt', 'updatedAt', 'title', 'path', 'order', 'isActive'])
    .optional()
    .catch(undefined),
  dir: z.enum(['asc', 'desc']).optional(),
  id: z.number().int().optional().catch(undefined),
  idRange: numberRangeSchema.optional().catch(undefined),
  title: z.string().optional().catch(undefined),
  path: z.string().optional().catch(undefined),
  isActive: z.boolean().optional().catch(undefined),
  createdAt: dateRangeSchema.optional().catch(undefined),
  updatedAt: dateRangeSchema.optional().catch(undefined),
  images: z.array(z.enum(['desktop', 'tablet', 'mobile'])).optional().catch(undefined),
});

export type TGetBannersForAdminSchema = z.infer<typeof getBannersForAdminSchema>;

export const getBannersForAdmin = createServerFn({ method: 'GET' })
  .inputValidator(getBannersForAdminSchema)
  .handler(async ({ data }) => {
    const where: Prisma.BannerWhereInput = {};

    if (hasValue(data.images)) {
      if (data.images?.includes('desktop'))
        where.desktopImage = { isNot: null };

      if (data.images?.includes('tablet'))
        where.tabletImage = { isNot: null };

      if (data.images?.includes('mobile'))
        where.mobileImage = { isNot: null };
    }


    if (data.id) where.id = { equals: data.id };

    if (data.idRange) {
      const [minId, maxId] = data.idRange;
      where.id = {};

      if (minId !== null)
        where.id.gte = minId;

      if (maxId !== null)
        where.id.lte = maxId;
    }

    if (!!data.title)
      where.OR = [{ title: { contains: data.title, mode: 'insensitive' } }];

    if (!!data.path)
      where.path = { contains: data.path, mode: 'insensitive' };

    if (hasValue(data.isActive))
      where.isActive = { equals: data.isActive };

    if (data.createdAt?.from || data.createdAt?.to) {
      where.createdAt = {};

      if (data.createdAt.from)
        where.createdAt.gte = data.createdAt.from;

      if (data.createdAt.to)
        where.createdAt.lte = data.createdAt.to;
    }

    if (data.updatedAt?.from || data.updatedAt?.to) {
      where.updatedAt = {};
      if (data.updatedAt.from)
        where.updatedAt.gte = data.updatedAt.from;

      if (data.updatedAt.to)
        where.updatedAt.lte = data.updatedAt.to;
    }

    const items = await prisma.banner.findMany({
      include: {
        desktopImage: true,
        tabletImage: true,
        mobileImage: true
      },
      orderBy: { [data.order ?? 'order']: data.dir ?? 'asc' },
      where: where
    });

    return AdminBannerBriefDtoFactory.fromEntities(items);
  });

export function getBannersForAdminQueryOptions(params: TGetBannersForAdminSchema) {
  return queryOptions({
    queryKey: ['banners', 'admin', params],
    queryFn: () => getBannersForAdmin({ data: params }),
    staleTime: 10_000,
    gcTime: 10_000
  });
}