import { adminNewsSearch } from './search';
import { adminNewsGetById } from './get-by-id';
import { adminNewsCreate } from './create';
import { adminNewsUpdate } from './update';
import { adminNewsDelete } from './delete';
import { adminNewsDeleteMany } from './delete-many';
import { adminNewsSetImage } from './set-image';
import { adminNewsRemoveImage } from './remove-image';

export const newsAdminRoutes = {
  search: adminNewsSearch,
  getById: adminNewsGetById,
  create: adminNewsCreate,
  update: adminNewsUpdate,
  delete: adminNewsDelete,
  deleteMany: adminNewsDeleteMany,
  setImage: adminNewsSetImage,
  removeImage: adminNewsRemoveImage,
};
