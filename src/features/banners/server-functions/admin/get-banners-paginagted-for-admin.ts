import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { paginatedSchema } from '@/features/common/pagination/pagination-validation';
import z from 'zod';
import { queryOptions } from '@tanstack/react-query';
import { Prisma } from '@prisma/client';
import { PaginationResultDtoFactory } from '@/features/common/pagination/pagination-result-dto';
import { dateRangeSchema, numberRangeSchema } from '@/components/data-table';
import { hasValue } from '@/utils/has-value';
import { AdminBannerBriefDtoFactory } from '@/features/banners/dtos/admin-banner-brief-dto';

export const getBannersPaginatedForAdminSchema = paginatedSchema.extend({
  order: z.enum(['id', 'createdAt', 'updatedAt', 'title', 'order', 'isActive'])
    .optional()
    .catch(undefined),
  id: z.number().int().optional().catch(undefined),
  idRange: numberRangeSchema.optional().catch(undefined),
  title: z.string().optional().catch(undefined),
  path: z.string().optional().catch(undefined),
  isActive: z.boolean().optional().catch(undefined),
  createdAt: dateRangeSchema.optional().catch(undefined),
  updatedAt: dateRangeSchema.optional().catch(undefined),
  hasDesktopImage: z.boolean().optional().catch(undefined),
  hasTabletImage: z.boolean().optional().catch(undefined),
  hasMobileImage: z.boolean().optional().catch(undefined)
});

export type TGetBannersPaginatedParamsForAdmin = z.infer<
  typeof getBannersPaginatedForAdminSchema
>;

export const getBannersPaginatedForAdmin = createServerFn({ method: 'GET' })
  .inputValidator(getBannersPaginatedForAdminSchema)
  .handler(async ({ data }) => {
    const where: Prisma.BannerWhereInput = {};

    if (hasValue(data.hasDesktopImage))
      where.desktopImage = data.hasDesktopImage
        ? { isNot: null }
        : { is: null };

    if (hasValue(data.hasTabletImage))
      where.tabletImage = data.hasTabletImage
        ? { isNot: null }
        : { is: null };

    if (hasValue(data.hasMobileImage))
      where.mobileImage = data.hasMobileImage
        ? { isNot: null }
        : { is: null };

    if (data.id) where.id = { equals: data.id };

    if (data.idRange) {
      const [minId, maxId] = data.idRange;
      where.id = {};

      if (minId !== null) where.id.gte = minId;

      if (maxId !== null) where.id.lte = maxId;
    }

    if (!!data.title)
      where.OR = [
        { titleRo: { contains: data.title, mode: 'insensitive' } },
        { titleRu: { contains: data.title, mode: 'insensitive' } }
      ];

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

    const [items, meta] = await prisma.banner
      .paginate({
        include: {
          desktopImage: true,
          tabletImage: true,
          mobileImage: true
        },
        orderBy: { [data.order ?? 'id']: data.dir ?? 'desc' },
        where
      })
      .withPages({
        includePageCount: true,
        limit: data.limit ?? 10,
        page: data.page ?? 1
      });

    return PaginationResultDtoFactory.getWithCount(
      AdminBannerBriefDtoFactory.fromEntities(items),
      meta
    );
  });

export function getBannersPaginatedForAdminQueryOptions(
  params: TGetBannersPaginatedParamsForAdmin
) {
  return queryOptions({
    queryKey: ['banners', 'paginated', params],
    queryFn: () => getBannersPaginatedForAdmin({ data: params }),
    staleTime: 30_000,
    gcTime: 30_000
  });
}