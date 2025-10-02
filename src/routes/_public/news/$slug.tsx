import { createFileRoute, notFound } from '@tanstack/react-router';
import { getNewsBySlugQueryOptions } from '@/features/news/server-functions/public/get-news-by-slug';
import { useSuspenseQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ro, ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import UnLazyImageSSR from '@/components/un-lazy-image-ssr';
import imgPlaceholder from '/images/news/placeholder.webp';
import { NotFoundCard } from '@/components/not-found-card';


export const Route = createFileRoute('/_public/news/$slug')({
  component: RouteComponent,
  staticData: {
    headerOptions: { type: 'fixed' }
  },
  loader: async ({ context: { queryClient }, params: { slug } }) => {
    const res = await queryClient
      .ensureQueryData(getNewsBySlugQueryOptions(slug))
      .catch(e => {
        console.error(e);
        throw notFound();
      });

    return { news: res };
  },
  notFoundComponent: () => {

    return (
      <>
        <div className="relative w-full h-64 sm:h-80 md:h-96">
          <UnLazyImageSSR
            className="absolute inset-0 h-full w-full object-cover brightness-50"
            src={imgPlaceholder}
            thumbhash={'WecNFYR5dmZiiHegiJiIqptRfxf2'}
          />

          <div className="absolute inset-0 bg-black/20 backdrop-blur"/>

          <div
            className="absolute inset-0 space-y-2 flex flex-col items-center justify-center text-center text-white p-4 pt-8"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
              Oops...
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/80">
              News has not been found
            </p>
          </div>
        </div>
        <main className="container mx-auto p-4">
          <NotFoundCard className="mx-auto"/>
        </main>
      </>
    );
  }
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery({ ...getNewsBySlugQueryOptions(slug) });

  return (
    <main className="space-y-4 md:space-y-6 lg:space-y-8 pb-16">
      <header className="relative w-full h-64 sm:h-80 md:h-96">
        <UnLazyImageSSR
          className="absolute inset-0 h-full w-full object-cover brightness-50"
          src={data.image?.url ?? imgPlaceholder}
          thumbhash={!!data.image ? data.image.thumbhash : 'qPcFDIDImA3ulpqUfjRHaF/Ahw=='}
        />

        <div className="absolute inset-0 bg-black/20 backdrop-blur"/>

        <div
          className="absolute inset-0 space-y-2 flex flex-col items-center justify-center text-center text-white p-4 pt-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            {data?.title}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-white/80">
            Published {data && format(data.createdAt, 'd MMMM yyyy', { locale: ro })}
          </p>
        </div>
      </header>

      {data?.content && (
        <div
          dangerouslySetInnerHTML={{ __html: data.content }}
          className={cn(
            'mt-4 prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl focus:outline-none',
            'max-w-4xl mx-auto p-4'
          )}
        />
      )}
    </main>

  );
}
