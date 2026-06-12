import { createFileRoute } from '@tanstack/react-router';
import { CategoriesTable } from '@/routes/admin/categories/-components/catergories-table';
import { getCategoriesPaginatedForAdminSchema } from '@/features/categories/schemas/search-categories';
import { orpc } from '@/lib/orpc';
import { awaitIfServer } from '@/lib/await-if-server';


export const Route = createFileRoute('/admin/categories/')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Categories' }] }),
  staticData: { breadcrumbs: [{ title: 'Categories' }] },
  validateSearch: getCategoriesPaginatedForAdminSchema,
  loaderDeps: (deps) => (deps),
  loader: async ({ context, deps: { search } }) => {
    await awaitIfServer(context.queryClient.prefetchQuery(orpc.admin.categories.search.queryOptions({ input: search })));
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