import { ComponentProps, FC } from 'react';
import { getLatestNewsQueryOptions } from '@/features/news/server-functions/public/get-latest-news';
import { useQuery } from '@tanstack/react-query';
import NewsPreviewLink from '@/components/news-preview-link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { NewspaperIcon } from 'lucide-react';


interface ILatestNewsProps extends ComponentProps<'section'> {
}

const LatestNews: FC<ILatestNewsProps> = ({ className, ...props }) => {
  const { data } = useQuery({ ...getLatestNewsQueryOptions() });

  return (
    <section aria-label="Latest news" className={cn('space-y-8', className)} {...props}>
      <div className="flex gap-2 items-end">

        <div>
          <h2 className="text-3xl font-bold">
            Latest news
          </h2>
          <p className="text-muted-foreground mt-2">
            Fresh updates, straight to you
          </p>
        </div>

        <Button variant="link" className='ml-auto' asChild>
          <Link to="/news">
            <NewspaperIcon/>
            <span>See all</span>
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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