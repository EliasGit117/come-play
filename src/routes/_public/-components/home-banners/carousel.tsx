import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import videoBanner from '/videos/home/banners/video-banner.mp4';
import banner1 from '/images/home/banners/banner-1.webp';
import banner2 from '/images/home/banners/banner-2.webp';
import banner3 from '/images/home/banners/banner-3.webp';
import videoPreview from '/images/home/banners/video-placeholder.webp';
import { ComponentProps, FC, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as React from 'react';
import VideoPlaceholder from '@/video-placeholder';
import { Link, LinkOptions } from '@tanstack/react-router';

interface IBannerData {
  heading: string;
  subheading?: string;
  link?: LinkOptions;
}

interface IBanner {
  imgSrc: string;
  data?: IBannerData;
}

const banners: IBanner[] = [
  {
    imgSrc: banner1,
    data: {
      heading: 'Outdoor LED Display',
      subheading: 'K series outdoor LED screen',
      link: { to: '/' }
    }
  },
  { imgSrc: banner2 },
  {
    imgSrc: banner3,
    data: {
      heading: 'Rental Outdoor LED Video\nWall E/F Series',
      subheading: 'Quickly present exquisite display for your show anywhere',
      link: { to: '/' }
    }
  }
];


interface IProps extends ComponentProps<typeof Carousel> {
}

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
        <CarouselItem className="relative pl-0">
          <VideoPlaceholder
            placeholder={
              <img
                fetchPriority="high"
                src={videoPreview}
                alt="placeholder"
                className="min-h-96 h-full w-full max-h-svh object-cover"
              />
            }
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              webkit-playsinline="true"
              className="brightness-50 min-h-96 object-cover w-full max-h-svh"
            >
              <source src={videoBanner} type="video/mp4"/>
            </video>
          </VideoPlaceholder>

          <BannerOverlay data={{ heading: 'itc LED Display Solution', link: { to: '/' } }}/>
        </CarouselItem>

        {banners.map((banner, index) => (
          <CarouselItem key={index} className="relative pl-0">
            <img
              src={banner.imgSrc}
              alt={`banner-${index}`}
              className="min-h-96 object-cover w-full max-h-svh brightness-75"
              key={index}
            />
            {banner.data && <BannerOverlay data={banner.data}/>}
          </CarouselItem>
        ))}
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
                <span className='sr-only'>To {current} slide</span>
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

interface BannerOverlayProps {
  data: IBannerData;
  className?: string;
}

const BannerOverlay: React.FC<BannerOverlayProps> = ({ data, className }) => {
  return (
    <div className={cn('absolute z-20 left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full', className)}>
      <div
        className="container mx-auto py-4 px-8 space-y-3 sm:space-y-4 lg:space-y-5 xl:space-y-6 text-white whitespace-pre-line">
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-semibold leading-tight">
          {data.heading}
        </p>
        {data.subheading && (
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
            {data.subheading}
          </p>
        )}
        {data.link && (
          <Button
            variant="secondary"
            className="text-xs sm:text-sm md:text-base lg:h-10 xl:h-12"
            asChild
          >
            <Link {...data.link}>
              Show details
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

