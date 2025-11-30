import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import { ComponentProps, FC, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getBannersQueryOptions } from '@/features/banners/server-functions/public/get-banners';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { BannerOverlay } from '@/routes/_public/-components/home-banners/banner-overlay';
import { BannerImage } from '@/routes/_public/-components/home-banners/banner-image';
import { VideoBanner } from '@/routes/_public/-components/home-banners/video-banner';


interface IProps extends ComponentProps<typeof Carousel> {}

export const HomeBannersCarousel: FC<IProps> = ({ className, ...props }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const { isPending, data } = useQuery(getBannersQueryOptions());

  useEffect(() => {
    if (!api)
      return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);


  if (isPending)
    return (<Skeleton className="flex flex-col w-full aspect-[3/2] min-h-[512px]"/>);

  return (
    <Carousel
      {...props}
      className={cn('w-full', className)}
      setApi={setApi}
      opts={{ loop: true }}
      plugins={[Autoplay({ delay: 23000 })]}
    >
      <CarouselContent>
        {(!!data && data.length > 0) ? (
          data?.map((banner, index) => {
            const hasData = !!banner.title || banner.text;

            return (
              <CarouselItem key={index} className="relative pl-0">
                <BannerImage banner={banner} className='min-h-[512px]'/>
                {hasData && (<BannerOverlay banner={banner}/>)}
              </CarouselItem>
            );
          })
        ) : (
          <VideoBanner/>
        )}
      </CarouselContent>

      {!!api && (

        <div className="absolute bottom-1 left-0 right-0 flex z-10">
          <div className="flex justify-center gap-2 py-2 mx-auto items-center">
            <Button
              data-slot="carousel-previous"
              variant="lightGhost"
              size="icon-xs"
              className={cn()}
              onClick={() => api?.scrollPrev()}
            >
              <ChevronLeftIcon/>
              <span className="sr-only">Previous slide</span>
            </Button>

            {Array.from({ length: count }).map((_, index) => (
              <Button
                key={index}
                variant="secondary"
                data-active={current === index + 1}
                className="size-3 p-0 data-[active=true]:bg-primary border data-[active=true]:border-secondary"
                onClick={() => api?.scrollTo(index)}
              >
                <span className="sr-only">To {current} slide</span>
              </Button>
            ))}

            <Button
              data-slot="carousel-previous"
              variant="lightGhost"
              size="icon-xs"
              className={cn()}
              onClick={() => api?.scrollNext()}
            >
              <ChevronRightIcon/>
              <span className="sr-only">Next slide</span>
            </Button>
          </div>
        </div>
      )}
    </Carousel>
  );
};