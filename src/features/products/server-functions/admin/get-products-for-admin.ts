import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { queryOptions } from '@tanstack/react-query';
import {
  dateRangeSchema,
  numberRangeSchema
} from '@/components/data-table';
import { hasValue } from '@/lib/has-value';
import { AdminProductBriefDtoFactory } from '@/features/products/dtos/admin-product-brief-dto';

export const getProductsForAdminSchema = z.object({
  order: z
    .enum([
      'id',
      'nameRo',
      'nameRu',
      'slug',
      'price',
      'state',
      'hidden',
      'createdAt',
      'updatedAt'
    ])
    .optional()
    .catch(undefined),
  dir: z.enum(['asc', 'desc']).optional(),
  id: z.number().int().optional().catch(undefined),
  idRange: numberRangeSchema.optional().catch(undefined),
  nameRo: z.string().optional().catch(undefined),
  nameRu: z.string().optional().catch(undefined),
  slug: z.string().optional().catch(undefined),
  state: z
    .enum(['available', 'not_available', 'out_of_stock'])
    .optional()
    .catch(undefined),
  hidden: z.boolean().optional().catch(undefined),
  createdAt: dateRangeSchema.optional().catch(undefined),
  updatedAt: dateRangeSchema.optional().catch(undefined)
});

export type TGetProductsForAdminSchema = z.infer<
  typeof getProductsForAdminSchema
>;

export const getProductsForAdmin = createServerFn({ method: 'GET' })
  .inputValidator(getProductsForAdminSchema)
  .handler(async ({ data }) => {
    const where: Prisma.ProductWhereInput = {};

    if (data.id) where.id = { equals: data.id };

    if (data.idRange) {
      const [minId, maxId] = data.idRange;
      where.id = {};
      if (minId !== null) where.id.gte = minId;
      if (maxId !== null) where.id.lte = maxId;
    }

    if (data.nameRo) {
      where.nameRo = { contains: data.nameRo, mode: 'insensitive' };
    }

    if (data.nameRu) {
      where.nameRu = { contains: data.nameRu, mode: 'insensitive' };
    }

    if (data.slug) {
      where.slug = { contains: data.slug, mode: 'insensitive' };
    }

    if (data.state) {
      where.state = { equals: data.state };
    }

    if (hasValue(data.hidden)) {
      where.hidden = { equals: data.hidden };
    }

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

    const items = await prisma.product.findMany({
      include: { images: true },
      orderBy: { [data.order ?? 'id']: data.dir ?? 'asc' },
      where
    });

    return AdminProductBriefDtoFactory.fromEntities(items);
  });

export function getProductsForAdminQueryOptions(
  params?: TGetProductsForAdminSchema
) {
  const paramsValue = params ?? {};

  return queryOptions({
    queryKey: ['admin', 'products', params],
    queryFn: () => getProductsForAdmin({ data: paramsValue }),
    staleTime: 10_000,
    gcTime: 10_000
  });
}