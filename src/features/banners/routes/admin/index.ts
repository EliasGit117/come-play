import { adminBannersSearch } from './search';
import { adminBannersGetById } from './get-by-id';
import { adminBannersCreate } from './create';
import { adminBannersUpdate } from './update';
import { adminBannersDelete } from './delete';
import { adminBannersDeleteMany } from './delete-many';
import { adminBannersReorder } from './reorder';
import { adminBannersSetImage } from './set-image';
import { adminBannersRemoveImage } from './remove-image';

export const bannersAdminRoutes = {
  search: adminBannersSearch,
  getById: adminBannersGetById,
  create: adminBannersCreate,
  update: adminBannersUpdate,
  delete: adminBannersDelete,
  deleteMany: adminBannersDeleteMany,
  reorder: adminBannersReorder,
  setImage: adminBannersSetImage,
  removeImage: adminBannersRemoveImage,
};
