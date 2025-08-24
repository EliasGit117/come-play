import { ComponentProps, FC } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { INewsBriefDto } from '@/features/news/dtos/news-brief-dto';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { BookOpenIcon, ImageMinusIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';


interface INewsCardProps extends ComponentProps<typeof Card> {
  news: INewsBriefDto;
}

const NewsCard: FC<INewsCardProps> = ({ news, className, ...props }) => {

  return (
    <Card className={cn('shadow-none border-none p-0 gap-2', className)} {...props}>
      <CardHeader className="px-0">
        {/*<figure className='aspect-square bg-muted rounded-lg flex justify-center items-center'>*/}
        {/*  <ImageMinusIcon className='size-8 text-muted-foreground/30'/>*/}
        {/*</figure>*/}
        <img
          className="rounded-lg aspect-square object-cover"
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