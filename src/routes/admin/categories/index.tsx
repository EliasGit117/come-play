import { createFileRoute } from '@tanstack/react-router';
import { CategoriesTable } from '@/routes/admin/categories/-components/catergories-table';
import { zodValidator } from '@tanstack/zod-adapter';
import {
  getCategoriesPaginatedForAdminQueryOptions,
  getCategoriesPaginatedForAdminSchema
} from '@/features/categories/server-functions/admin/get-categories-paginated-for-admin';


export const Route = createFileRoute('/admin/categories/')({
  component: RouteComponent,
  validateSearch: zodValidator(getCategoriesPaginatedForAdminSchema),
  loaderDeps: (deps) => (deps),
  loader: async ({ context, deps: { search } }) => {
    return context.queryClient.prefetchQuery(getCategoriesPaginatedForAdminQueryOptions(search));
  },
  head: () => ({ meta: [{ title: 'News' }] })
});

function RouteComponent() {
  const search = Route.useSearch();

  return (
    <main className="container mx-auto p-4">
      <CategoriesTable search={search}/>
    </main>
  );
}