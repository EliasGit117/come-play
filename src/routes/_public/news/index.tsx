import { createFileRoute, Link } from '@tanstack/react-router';
import { getNewsPaginatedForAdminQueryOptions, getNewsPaginatedForAdminSchema } from '@/features/news/server-functions/admin/get-news-paginated-for-admin';
import { zodValidator } from '@tanstack/zod-adapter';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import NewsCard from '@/routes/_public/news/-components/news-card';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';


export const Route = createFileRoute('/_public/news/')({
  component: RouteComponent,
  validateSearch: zodValidator(getNewsPaginatedForAdminSchema),
  loaderDeps: ({ search }) => (search),
  loader: async ({ context: { queryClient }, deps }) => {
    const res = await queryClient.prefetchQuery(getNewsPaginatedForAdminQueryOptions(deps));
    return { news: res };
  }
});

function RouteComponent() {
  const searchParams = Route.useLoaderDeps();
  const { isPending, data } = useQuery({
    ...getNewsPaginatedForAdminQueryOptions(searchParams),
    placeholderData: keepPreviousData
  });

  const page = searchParams.page ?? 1;

  return (
    <main className="container mx-auto p-4 space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">News</h1>
        <p className="text-muted-foreground">Stay updated with the most recent articles</p>
      </header>

      <section
        aria-label="News list"
        className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        {data?.items.map((item) => (
          <article key={item.title}>
            <NewsCard news={item}/>
          </article>
        ))}
      </section>

      <div className="flex gap-2 mt-16">
        <div className="flex gap-1 ml-auto">
          <Button size="icon" variant="outline" disabled={page <= 1} asChild>
            <Link
              from='/news'
              to="."
              search={pv => ({ ...pv, page: page - 1 })}
              disabled={page <= 1}
            >
              <ChevronLeftIcon/>
            </Link>
          </Button>

          <Button size="icon" variant="outline" disabled={page >= (data?.pageCount ?? 1)} asChild>
            <Link
              from='/news'
              to="."
              search={pv => ({ ...pv, page: page + 1 })}
              disabled={page >= (data?.pageCount ?? 1)}
            >
              <ChevronRightIcon/>
            </Link>
          </Button>
        </div>

      </div>
    </main>
  );
}
