import { createFileRoute, notFound } from '@tanstack/react-router';
import { getNewsBySlugQueryOptions } from '@/features/news/server-functions/public/get-news-by-slug';
import { useSuspenseQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';


export const Route = createFileRoute('/_public/news/$slug')({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params: { slug } }) => {
    const res = await queryClient
      .ensureQueryData(getNewsBySlugQueryOptions(slug))
      .catch(e => {
        console.error(e);
        throw notFound();
      });

    return { news: res };
  }

});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery({ ...getNewsBySlugQueryOptions(slug) });

  return (
    <main className="container mx-auto p-4 space-y-8 pt-8 pb-16">
      <header>
        <p className="text-muted-foreground text-xs">
          {data && format(data.createdAt, 'dd.MM.yyyy - HH:mm')}
        </p>
        <h1 className="text-2xl sm:text-3xl xl:text-4xl  font-semibold tracking-tight">
          {data?.title}
        </h1>
      </header>

      <Separator className="opacity"/>

      {data?.content && (
        <div
          dangerouslySetInnerHTML={{ __html: data.content }}
          className={cn(
            'mt-4 prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl focus:outline-none max-w-none'
          )}
        />
      )}
    </main>

  );
}
