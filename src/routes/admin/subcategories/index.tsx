import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import {
  getSubcategoriesPaginatedForAdminQueryOptions,
  getSubcategoriesPaginatedForAdminSchema
} from '@/features/subcategories/server-functions/admin/get-subcategories-paginated';
import { SubcategoriesTable } from '@/routes/admin/subcategories/-components/subcategories-table';
import { awaitIfServer } from '@/lib/await-if-server';


export const Route = createFileRoute('/admin/subcategories/')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Subcategories' }] }),
  staticData: { breadcrumbs: [{ title: 'Subcategories' }] },
  validateSearch: zodValidator(getSubcategoriesPaginatedForAdminSchema),
  loaderDeps: (deps) => (deps),
  loader: async ({ context, deps: { search } }) => {
    await awaitIfServer(context.queryClient.prefetchQuery(getSubcategoriesPaginatedForAdminQueryOptions(search)));
  },
});

function RouteComponent() {
  const search = Route.useSearch();

  return (
    <main className="container mx-auto p-4">
      <SubcategoriesTable search={search} />
    </main>
  );
}