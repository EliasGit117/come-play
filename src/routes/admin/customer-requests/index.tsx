import { createFileRoute } from '@tanstack/react-router';
import { getCustomerRequestsPaginatedForAdminSchema } from '@/features/customer-requests/schemas/search-customer-requests';
import { orpc } from '@/lib/orpc';
import { CustomerRequestsTable } from './-components/customer-requests-table';
import { awaitIfServer } from '@/lib/await-if-server';
import { m } from '@/paraglide/messages';


export const Route = createFileRoute('/admin/customer-requests/')({
  component: Component,
  validateSearch: getCustomerRequestsPaginatedForAdminSchema,
  loaderDeps: (deps) => (deps),
  loader: async ({ context, deps: { search } }) => {
    await awaitIfServer(context.queryClient.prefetchQuery(orpc.admin.customerRequests.search.queryOptions({ input: search })));
  },
  head: () => ({ meta: [{ title: m['pages.admin.customerRequests.head.list']() }] })
});

function Component() {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const search = Route.useSearch();

  return (
    <main className="container mx-auto p-4 space-y-4 flex flex-col flex-1">
      <CustomerRequestsTable search={search}/>
    </main>
  );
}
