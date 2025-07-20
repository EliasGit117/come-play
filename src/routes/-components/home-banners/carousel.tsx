import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import videoBanner from '/public/videos/home/banners/video-banner.mp4';
import banner1 from '/public/images/home/banners/banner-1.webp';
import banner2 from '/public/images/home/banners/banner-2.webp';
import banner3 from '/public/images/home/banners/banner-3.webp';
import banner4 from '/public/images/home/banners/banner-4.webp';
import { ComponentProps, FC, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as React from 'react';


const banners: { imgSrc: string; }[] = [
  { imgSrc: banner1 },
  { imgSrc: banner2 },
  { imgSrc: banner3 },
  { imgSrc: banner4 }
];



interface IProps extends ComponentProps<typeof Carousel> {}

export const HomeBannersCarousel: FC<IProps> = ({ className, ...props }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api)
      return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  return (
    <Carousel
      {...props}
      className={cn('w-full', className)}
      setApi={setApi}
      opts={{ loop: true }}
      plugins={[Autoplay({ delay: 23000 })]}
    >
      <CarouselContent>
        <CarouselItem>
          <video
            autoPlay
            muted
            loop
            playsInline
            webkit-playsinline="true"
            className='brightness-50 min-h-96 object-cover w-full max-h-svh'
          >
            <source src={videoBanner} type="video/mp4"/>
          </video>
        </CarouselItem>
        {banners.map((banner, index) => (
          <CarouselItem key={index}>
            <img src={banner.imgSrc} alt={`banner-${index}`} className="min-h-96 object-cover w-full max-h-svh" key={index}/>
          </CarouselItem>
        ))}
      </CarouselContent>

      {!!api && (

        <div className="absolute bottom-1 left-0 right-0 flex z-10">
          <div className="flex justify-center gap-2 py-2 mx-auto items-center">
            <Button
              data-slot="carousel-previous"
              variant="lightGhost"
              size="xsIcon"
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
              />
            ))}

            <Button
              data-slot="carousel-previous"
              variant="lightGhost"
              size="xsIcon"
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

