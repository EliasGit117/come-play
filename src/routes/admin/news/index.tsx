import { createFileRoute } from '@tanstack/react-router';
import { getNewsPaginatedForAdminSchema } from '@/features/news/schemas/search-news';
import { orpc } from '@/lib/orpc';
import { NewsTable } from './-components/news-table';
import { awaitIfServer } from '@/lib/await-if-server';


export const Route = createFileRoute('/admin/news/')({
  component: Component,
  validateSearch: getNewsPaginatedForAdminSchema,
  loaderDeps: (deps) => (deps),
  loader: async ({ context, deps: { search } }) => {
    await awaitIfServer(context.queryClient.prefetchQuery(orpc.admin.news.search.queryOptions({ input: search })));
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
