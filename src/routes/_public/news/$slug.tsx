import { createFileRoute } from '@tanstack/react-router'
import { getNewsBySlugQueryOptions } from '@/features/news/server-functions/get-news-by-slug';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

export const Route = createFileRoute('/_public/news/$slug')({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params: { slug } }) => {
    const res = await queryClient.prefetchQuery(getNewsBySlugQueryOptions(slug))
    return { news: res }
  }
})

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data } = useQuery({
    ...getNewsBySlugQueryOptions(slug),
    placeholderData: keepPreviousData,
  });

  return (
    <main className="container mx-auto p-4 space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">{data?.title}</h1>
        <p className="text-muted-foreground">{data && format(data.createdAt, 'dd.MM.yyyy - HH:mm')}</p>
      </header>

      <section aria-label="News list" className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      </section>
    </main>
  );
}
