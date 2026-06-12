import { base } from '@/features/shared/orpc/base';

export const bannersAdminTag = 'Admin Banners';
export const bannersAdminPath = '/admin/banners';

export const bannersAdminBase = base.route({
  tags: [bannersAdminTag],
  path: bannersAdminPath,
});
