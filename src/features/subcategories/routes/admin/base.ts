import { base } from '@/features/shared/orpc/base';

export const subcategoriesAdminTag = 'Admin Subcategories';
export const subcategoriesAdminPath = '/admin/subcategories';

export const subcategoriesAdminBase = base.route({
  tags: [subcategoriesAdminTag],
  path: subcategoriesAdminPath,
});
