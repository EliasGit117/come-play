import { createFileRoute } from '@tanstack/react-router';
import { getSubcategoriesPaginatedForAdminSchema } from '@/features/subcategories/schemas/search-subcategories';
import { orpc } from '@/lib/orpc';
import { SubcategoriesTable } from '@/routes/admin/subcategories/-components/subcategories-table';
import { awaitIfServer } from '@/lib/await-if-server';


export const Route = createFileRoute('/admin/subcategories/')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Subcategories' }] }),
  staticData: { breadcrumbs: [{ title: 'Subcategories' }] },
  validateSearch: getSubcategoriesPaginatedForAdminSchema,
  loaderDeps: (deps) => (deps),
  loader: async ({ context, deps: { search } }) => {
    await awaitIfServer(context.queryClient.prefetchQuery(orpc.admin.subcategories.search.queryOptions({ input: search })));
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