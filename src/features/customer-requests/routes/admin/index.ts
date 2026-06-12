import { adminCustomerRequestsSearch } from './search';
import { adminCustomerRequestsDelete } from './delete';
import { adminCustomerRequestsDeleteMany } from './delete-many';

export const customerRequestsAdminRoutes = {
  search: adminCustomerRequestsSearch,
  delete: adminCustomerRequestsDelete,
  deleteMany: adminCustomerRequestsDeleteMany,
};
