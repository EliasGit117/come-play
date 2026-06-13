import { base } from '@/features/shared/orpc/base';

export const dashboardAdminTag = 'Admin Dashboard';
export const dashboardAdminPath = '/admin/dashboard';

export const dashboardAdminBase = base.route({
  tags: [dashboardAdminTag],
  path: dashboardAdminPath,
});
