import { type } from '@orpc/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { hasValue } from '@/lib/has-value';
import { productsAdminBase, productsAdminPath } from './base';
import { getProductsForAdminSchema } from '@/features/products/schemas/search-products';
import { AdminProductBriefDtoFactory, IAdminProductBriefDto } from '@/features/products/dtos/admin-product-brief-dto';

export const adminProductsSearch = productsAdminBase
  .route({
    method: 'POST',
    path: `${productsAdminPath}/search`,
    summary: 'Search products',
    description: 'Returns a list of products',
  })
  .errors({ FORBIDDEN: {} })
  .use(authMiddleware)
  .input(getProductsForAdminSchema)
  .output(type<IAdminProductBriefDto[]>())
  .handler(async ({ input: data, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { products: ['list'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const where: Prisma.ProductWhereInput = {};

    if (data.id) where.id = { equals: data.id };

    if (data.idRange) {
      const [minId, maxId] = data.idRange;
      where.id = {};
      if (minId !== null) where.id.gte = minId;
      if (maxId !== null) where.id.lte = maxId;
    }

    if (data.nameRo) where.nameRo = { contains: data.nameRo, mode: 'insensitive' };
    if (data.nameRu) where.nameRu = { contains: data.nameRu, mode: 'insensitive' };
    if (data.slug) where.slug = { contains: data.slug, mode: 'insensitive' };
    if (data.state) where.state = { equals: data.state };
    if (hasValue(data.hidden)) where.hidden = { equals: data.hidden };

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
      where,
    });

    return AdminProductBriefDtoFactory.fromEntities(items);
  });
