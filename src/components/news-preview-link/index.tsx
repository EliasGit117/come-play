import { ComponentProps, FC } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import UnLazyImageSSR from '@/components/un-lazy-image-ssr';
import { ImageOffIcon } from 'lucide-react';
import { INewsBriefDto } from '@/features/news/dtos/news-brief-dto';


interface INewsPreviewLinkProps extends ComponentProps<typeof Button> {
  news: INewsBriefDto;
}

const NewsPreviewLink: FC<INewsPreviewLinkProps> = ({ news, className, ...props }) => {

  return (
    <Button
      variant="link"
      size="dense"
      className="group flex-col items-start p-0 rounded-md w-full h-full hover:no-underline"
      asChild
      {...props}
    >
      <Link to="/news/$slug" params={{ slug: news.slug }}>
        {news.image ? (
          <figure className='rounded-lg border overflow-clip'>
            <UnLazyImageSSR
              className="aspect-video object-cover h-full w-full"
              src={news.image.url}
              thumbhash={news.image.thumbhash}
              alt={`${news.title} news image`}
            />
          </figure>
        ) : (
          <figure className="rounded-lg aspect-video h-full w-full bg-muted flex items-center justify-center border">
            <ImageOffIcon className="size-6 text-muted-foreground/25"/>
          </figure>
        )}

        <div>
          <h1 className="text-lg font-medium group-hover:underline">
            {news.title}
          </h1>
          <p className="text-muted-foreground text-xs">
            {format(news.createdAt, 'dd.MM.yyyy - HH:mm')}
          </p>
        </div>
      </Link>
    </Button>
  );
};

export default NewsPreviewLink;