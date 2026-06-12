import { adminProductsSearch } from './search';
import { adminProductsGetById } from './get-by-id';
import { adminProductsCreate } from './create';
import { adminProductsUpdate } from './update';
import { adminProductsDelete } from './delete';
import { adminProductsAddImage } from './add-image';
import { adminProductsDeleteImage } from './delete-image';
import { adminProductsReorderImages } from './reorder-images';

export const productsAdminRoutes = {
  search: adminProductsSearch,
  getById: adminProductsGetById,
  create: adminProductsCreate,
  update: adminProductsUpdate,
  delete: adminProductsDelete,
  addImage: adminProductsAddImage,
  deleteImage: adminProductsDeleteImage,
  reorderImages: adminProductsReorderImages,
};
