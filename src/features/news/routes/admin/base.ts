import { base } from '@/features/shared/orpc/base';

export const newsAdminTag = 'Admin News';
export const newsAdminPath = '/admin/news';

export const newsAdminBase = base.route({
  tags: [newsAdminTag],
  path: newsAdminPath,
});
