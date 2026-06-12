import { adminCategoriesSearch } from './search';
import { adminCategoriesGetById } from './get-by-id';
import { adminCategoriesCreate } from './create';
import { adminCategoriesUpdate } from './update';
import { adminCategoriesDelete } from './delete';

export const categoriesAdminRoutes = {
  search: adminCategoriesSearch,
  getById: adminCategoriesGetById,
  create: adminCategoriesCreate,
  update: adminCategoriesUpdate,
  delete: adminCategoriesDelete,
};
