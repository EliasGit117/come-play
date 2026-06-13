import { base } from '@/features/shared/orpc/base';

export const customerRequestsPublicTag = 'Customer Requests';
export const customerRequestsPublicPath = '/customer-requests';

export const customerRequestsPublicBase = base.route({
  tags: [customerRequestsPublicTag],
  path: customerRequestsPublicPath,
});
