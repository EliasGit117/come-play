import { base } from '@/features/shared/orpc/base';

export const customerRequestsAdminTag = 'Admin Customer Requests';
export const customerRequestsAdminPath = '/admin/customer-requests';

export const customerRequestsAdminBase = base.route({
  tags: [customerRequestsAdminTag],
  path: customerRequestsAdminPath,
});
