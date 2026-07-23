import { createFileRoute, notFound } from '@tanstack/react-router';
import { orpc } from '@/lib/orpc';
import { useSuspenseQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ro, ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import UnLazyImageSSR from '@/components/un-lazy-image-ssr';
import imgPlaceholder from '/images/news/placeholder.webp';
import { NotFoundCard } from '@/components/not-found-card';
import { m } from '@/paraglide/messages';
import { getLocale } from '@/paraglide/runtime';
import { seo } from '@/utils/seo';
import { htmlToExcerpt } from '@/utils/text';

const dateLocales = { ro, ru } as const;


export const Route = createFileRoute('/_public/news/$slug')({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params: { slug } }) => {
    const res = await queryClient
      .ensureQueryData(orpc.news.getBySlug.queryOptions({ input: { slug } }))
      .catch(e => {
        console.error(e);
        throw notFound();
      });

    return { news: res };
  },
  head: ({ loaderData }) => {
    const news = loaderData?.news;
    if (!news)
      return {
        meta: seo({
          title: m['pages.public.news.notFound.title'](),
          description: m['pages.public.news.notFound.text']()
        })
      };

    return {
      meta: seo({
        title: news.title,
        description: htmlToExcerpt(news.content),
        image: news.image?.url
      })
    };
  },
  notFoundComponent: () => {

    return (
      <main className="space-y-4 md:space-y-6 lg:space-y-8 pb-16 pt-6">
        <header className="container mx-auto px-4 max-w-4xl">
          <div className="relative overflow-hidden rounded-xl border border-border/50">
            <UnLazyImageSSR
              className="w-full h-[280px] md:h-[420px] object-cover"
              src={imgPlaceholder}
              thumbhash={'WecNFYR5dmZiiHegiJiIqptRfxf2'}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10"/>

            <div className="absolute inset-0 flex flex-col justify-end gap-3 md:gap-4 p-6 md:p-10 text-white">
              <h1 className="text-3xl md:text-5xl font-bold max-w-3xl leading-tight">
                {m['pages.public.news.notFound.title']()}
              </h1>
              <p className="text-sm md:text-lg text-white/85">
                {m['pages.public.news.notFound.text']()}
              </p>
            </div>
          </div>
        </header>

        <div className="container mx-auto p-4 max-w-4xl">
          <NotFoundCard className="mx-auto"/>
        </div>
      </main>
    );
  }
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery({ ...orpc.news.getBySlug.queryOptions({ input: { slug } }) });

  return (
    <main className="space-y-4 md:space-y-6 lg:space-y-8 pb-16 pt-6">
      <header className="container mx-auto px-4 max-w-4xl">
        <div className="relative overflow-hidden rounded-xl border border-border/50">
          <UnLazyImageSSR
            className="w-full h-[280px] md:h-[420px] object-cover"
            src={data.image?.url ?? imgPlaceholder}
            thumbhash={!!data.image ? data.image.thumbhash : 'qPcFDIDImA3ulpqUfjRHaF/Ahw=='}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10"/>

          <div className="absolute inset-0 flex flex-col justify-end gap-3 md:gap-4 p-6 md:p-10 text-white">
            <h1 className="text-3xl md:text-5xl font-bold max-w-3xl leading-tight">
              {data?.title}
            </h1>
            <p className="text-sm md:text-lg text-white/85">
              {m['pages.public.news.detail.published']()} {data && format(data.createdAt, 'd MMMM yyyy', { locale: dateLocales[getLocale()] })}
            </p>
          </div>
        </div>
      </header>

      {data?.content && (
        <div
          dangerouslySetInnerHTML={{ __html: data.content }}
          className={cn(
            'container mx-auto p-4 max-w-4xl mt-8',
            'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-x focus:outline-none',
          )}
        />
      )}
    </main>

  );
}
