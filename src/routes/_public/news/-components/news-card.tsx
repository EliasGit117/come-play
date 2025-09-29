import { ComponentProps, FC } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IAdminNewsBriefDto } from '@/features/news/dtos/admin-news-brief-dto';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { BookOpenIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import UnLazyImageSSR from '@/components/un-lazy-image-ssr';


interface INewsCardProps extends ComponentProps<typeof Card> {
  news: IAdminNewsBriefDto;
}

const NewsCard: FC<INewsCardProps> = ({ news, className, ...props }) => {

  return (
    <Card className={cn('shadow-none border-none p-0 gap-2', className)} {...props}>
      <CardHeader className="px-0">
        <UnLazyImageSSR
          thumbhash='WjgKDwjimZiRlYfKUweWtpaEZ3EJF5gA'
          className="rounded-lg aspect-square object-cover h-full w-full"
          src="https://bundui-images.netlify.app/products/04.jpeg"
          alt="img"
        />
      </CardHeader>

      <CardContent className="px-0 flex">
        <div>
          <h1 className="text-lg font-medium">{news.title}</h1>
          <p className="text-muted-foreground text-xs">{format(news.createdAt, 'dd.MM.yyyy - HH:mm')}</p>
        </div>

        <Button size="icon" variant="outline" className="ml-auto mt-auto" asChild>
          <Link to="/news/$slug" params={{ slug: news.slug }}>
            <BookOpenIcon/>
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewsCard;