import { createFileRoute } from '@tanstack/react-router';
import { CategoriesTable } from '@/routes/admin/categories/-components/catergories-table';
import { zodValidator } from '@tanstack/zod-adapter';
import {
  getCategoriesPaginatedForAdminQueryOptions,
  getCategoriesPaginatedForAdminSchema
} from '@/features/categories/server-functions/admin/get-categories-paginated-for-admin';
import { awaitIfServer } from '@/lib/await-if-server';


export const Route = createFileRoute('/admin/categories/')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Categories' }] }),
  staticData: { breadcrumbs: [{ title: 'Categories' }] },
  validateSearch: zodValidator(getCategoriesPaginatedForAdminSchema),
  loaderDeps: (deps) => (deps),
  loader: async ({ context, deps: { search } }) => {
    await awaitIfServer(context.queryClient.prefetchQuery(getCategoriesPaginatedForAdminQueryOptions(search)));
  },
});

function RouteComponent() {
  const search = Route.useSearch();

  return (
    <main className="container mx-auto p-4">
      <CategoriesTable search={search}/>
    </main>
  );
}