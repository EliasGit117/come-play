import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import {
  getNewsPaginatedForAdminQueryOptions,
  getNewsPaginatedForAdminSchema
} from '@/features/news/server-functions/admin/get-news-paginated-for-admin';
import { NewsTable } from './-components/news-table';


export const Route = createFileRoute('/admin/news/')({
  component: Component,
  validateSearch: zodValidator(getNewsPaginatedForAdminSchema),
  loaderDeps: (deps) => (deps),
  loader: async ({ context, deps: { search } }) => {
    return context.queryClient.prefetchQuery(getNewsPaginatedForAdminQueryOptions(search));
  },
  head: () => ({ meta: [{ title: 'News' }] })
});

function Component() {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const search = Route.useSearch();

  return (
    <main className="container mx-auto p-4 space-y-4 flex flex-col flex-1">
      <NewsTable search={search}/>
    </main>
  );
}
