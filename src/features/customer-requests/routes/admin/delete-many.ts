import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { customerRequestsAdminBase, customerRequestsAdminPath } from './base';
import { deleteCustomerRequestByIdsSchema } from '@/features/customer-requests/schemas/search-customer-requests';

interface IDeleteCustomerRequestsManyResult {
  totalReceived: number;
  deletedCount: number;
}

export const adminCustomerRequestsDeleteMany = customerRequestsAdminBase
  .route({
    method: 'POST',
    path: `${customerRequestsAdminPath}/delete-many`,
    summary: 'Delete customer requests (bulk)',
    description: 'Deletes multiple customer requests',
  })
  .errors({ FORBIDDEN: {} })
  .use(authMiddleware)
  .input(deleteCustomerRequestByIdsSchema)
  .output(type<IDeleteCustomerRequestsManyResult>())
  .handler(async ({ input: { ids }, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { customerRequests: ['delete'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const result = await prisma.customerRequest.deleteMany({
      where: { id: { in: ids } },
    });

    return {
      totalReceived: ids.length,
      deletedCount: result.count,
    };
  });
