import { createFileRoute } from '@tanstack/react-router';
import { getProductsForAdminSchema } from '@/features/products/schemas/search-products';
import { orpc } from '@/lib/orpc';
import { ProductTable } from './-components/products-table';
import { awaitIfServer } from '@/lib/await-if-server';

export const Route = createFileRoute('/admin/products/')({
  component: RouteComponent,
  validateSearch: getProductsForAdminSchema,
  loaderDeps: (deps) => deps,
  loader: async ({ context, deps: { search } }) => {
    await awaitIfServer(context.queryClient.prefetchQuery(orpc.admin.products.search.queryOptions({ input: search })));
  },
  head: () => {
    return { meta: [{ title: 'Products' }] };
  }
});

function RouteComponent() {
  // noinspection BadExpressionStatementJS
  'use no memo';
  
  const search = Route.useSearch();

  return (
    <main className="container mx-auto p-4 space-y-4 flex flex-col flex-1">
      <ProductTable search={search} />
    </main>
  );
}