import { adminSubcategoriesSearch } from './search';
import { adminSubcategoriesGetById } from './get-by-id';
import { adminSubcategoriesCreate } from './create';
import { adminSubcategoriesUpdate } from './update';
import { adminSubcategoriesDelete } from './delete';

export const subcategoriesAdminRoutes = {
  search: adminSubcategoriesSearch,
  getById: adminSubcategoriesGetById,
  create: adminSubcategoriesCreate,
  update: adminSubcategoriesUpdate,
  delete: adminSubcategoriesDelete,
};
