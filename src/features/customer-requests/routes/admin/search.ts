import { type } from '@orpc/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { customerRequestsAdminBase, customerRequestsAdminPath } from './base';
import { getCustomerRequestsPaginatedForAdminSchema } from '@/features/customer-requests/schemas/search-customer-requests';
import { AdminCustomerRequestDtoFactory, IAdminCustomerRequestDto } from '@/features/customer-requests/dtos/admin-customer-request-dto';
import { IPaginationResultWithCountDto, PaginationResultDtoFactory } from '@/features/common/pagination/pagination-result-dto';

export const adminCustomerRequestsSearch = customerRequestsAdminBase
  .route({
    method: 'POST',
    path: `${customerRequestsAdminPath}/search`,
    summary: 'Search customer requests',
    description: 'Returns a paginated list of customer requests',
  })
  .errors({ FORBIDDEN: {} })
  .use(authMiddleware)
  .input(getCustomerRequestsPaginatedForAdminSchema)
  .output(type<IPaginationResultWithCountDto<IAdminCustomerRequestDto>>())
  .handler(async ({ input: data, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { customerRequests: ['list'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const where: Prisma.CustomerRequestWhereInput = {};

    if (data.id)
      where.id = { equals: data.id };

    if (data.idRange) {
      const [minId, maxId] = data.idRange;
      where.id = {};

      if (minId !== null)
        where.id.gte = minId;

      if (maxId !== null)
        where.id.lte = maxId;
    }

    if (!!data.name)
      where.OR = [
        { firstName: { contains: data.name, mode: 'insensitive' } },
        { lastName: { contains: data.name, mode: 'insensitive' } },
      ];

    if (!!data.email)
      where.email = { contains: data.email, mode: 'insensitive' };

    if (!!data.phone)
      where.phone = { contains: data.phone, mode: 'insensitive' };

    if (!!data.emailNotificationStatus) {
      if (Array.isArray(data.emailNotificationStatus))
        where.emailNotificationStatus = { in: data.emailNotificationStatus };
      else
        where.emailNotificationStatus = { equals: data.emailNotificationStatus };
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

    const [items, meta] = await prisma.customerRequest
      .paginate({
        orderBy: { [data.order ?? 'id']: data.dir ?? 'desc' },
        where,
      })
      .withPages({
        includePageCount: true,
        limit: data.limit ?? 10,
        page: data.page ?? 1,
      });

    return PaginationResultDtoFactory.getWithCount(AdminCustomerRequestDtoFactory.fromEntities(items), meta);
  });
