import { type } from '@orpc/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { customerRequestsAdminBase, customerRequestsAdminPath } from './base';
import { deleteCustomerRequestByIdSchema } from '@/features/customer-requests/schemas/search-customer-requests';

export const adminCustomerRequestsDelete = customerRequestsAdminBase
  .route({
    method: 'POST',
    path: `${customerRequestsAdminPath}/delete`,
    summary: 'Delete customer request',
    description: 'Deletes a single customer request',
  })
  .errors({ FORBIDDEN: {} })
  .use(authMiddleware)
  .input(deleteCustomerRequestByIdSchema)
  .output(type<void>())
  .handler(async ({ input: { id }, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { customerRequests: ['delete'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    await prisma.customerRequest.delete({ where: { id } });
  });
