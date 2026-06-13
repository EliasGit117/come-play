import { IconNews } from '@tabler/icons-react';
import { ComponentProps, FC } from 'react';
import { orpc } from '@/lib/orpc';
import { useQuery } from '@tanstack/react-query';
import NewsPreviewLink from '@/components/news-preview-link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { m } from '@/paraglide/messages';



interface ILatestNewsProps extends ComponentProps<'section'> {
}

const LatestNews: FC<ILatestNewsProps> = ({ className, ...props }) => {
  const { data } = useQuery({ ...orpc.news.latest.queryOptions() });

  return (
    <section aria-label={m['pages.public.home.news.title']()} className={cn('space-y-8', className)} {...props}>
      <div className="flex gap-2 items-end">

        <div>
          <h2 className="text-3xl font-bold">
            {m['pages.public.home.news.title']()}
          </h2>
          <p className="text-muted-foreground mt-2">
            {m['pages.public.home.news.subtitle']()}
          </p>
        </div>

        <Button variant="link" className='ml-auto' asChild>
          <Link to="/news">
            <IconNews/>
            <span>{m['pages.public.home.news.seeAll']()}</span>
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.map((item) => (
          <article key={item.id}>
            <NewsPreviewLink news={item}/>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LatestNews;