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
import * as React from 'react';
import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getBannersQueryOptions } from '@/features/banners/server-functions/public/get-banners';
import { Skeleton } from '@/components/ui/skeleton';
import { IBannerDto } from '@/features/banners/dtos/banner-dto';
import UnLazyImageSSR from '@/components/un-lazy-image-ssr';
import { useMediaQuery } from '@/hooks/use-media-query';


interface IProps extends ComponentProps<typeof Carousel> {
}

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
    return (
      <div className="flex flex-col w-full aspect-[3/2]">
        <Skeleton className="flex-1 w-full"/>
      </div>
    );

  return (
    <Carousel
      {...props}
      className={cn('w-full', className)}
      setApi={setApi}
      opts={{ loop: true }}
      plugins={[Autoplay({ delay: 6000 })]}
    >
      <CarouselContent>
        {/*{(!data || data.length === 0) && (*/}
        {/*  <CarouselItem className="relative pl-0">*/}
        {/*    <VideoPlaceholder*/}
        {/*      placeholder={*/}
        {/*        <img*/}
        {/*          fetchPriority="high"*/}
        {/*          src={videoPreview}*/}
        {/*          alt="placeholder"*/}
        {/*          className="min-h-96 h-full w-full max-h-svh object-cover"*/}
        {/*        />*/}
        {/*      }*/}
        {/*    >*/}
        {/*      <video*/}
        {/*        autoPlay*/}
        {/*        muted*/}
        {/*        loop*/}
        {/*        playsInline*/}
        {/*        webkit-playsinline="true"*/}
        {/*        className="brightness-50 min-h-96 object-cover w-full max-h-svh"*/}
        {/*      >*/}
        {/*        <source src={videoBanner} type="video/mp4"/>*/}
        {/*      </video>*/}
        {/*    </VideoPlaceholder>*/}

        {/*    <BannerOverlay banner={{ heading: 'itc LED Display Solution' }}/>*/}
        {/*  </CarouselItem>*/}
        {/*)}*/}

        {data?.map((banner, index) => {
          const hasData = !!banner.title || banner.text;

          return (
            <CarouselItem key={index} className="relative pl-0">
              <BannerImage banner={banner}/>
              {hasData && (<BannerOverlay banner={banner}/>)}
            </CarouselItem>
          );
        })}
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


interface BannerOverlayProps {
  banner: IBannerDto;
  className?: string;
}

const BannerOverlay: React.FC<BannerOverlayProps> = ({ banner, className }) => {
  const { title, text, path } = banner;

  return (
    <div className={cn('absolute z-20 left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full', className)}>
      <div
        className="container mx-auto py-4 px-8 space-y-3 sm:space-y-4 lg:space-y-5 xl:space-y-6 text-white whitespace-pre-line">
        {title && (
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-semibold leading-tight">
            {title}
          </p>
        )}

        {text && (
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
            {text}
          </p>
        )}

        {path && (
          <Button className="text-xs sm:text-sm md:text-base h-fit lg:h-10 xl:h-12 !bg-white !text-black" asChild>
            <Link to={path}>
              Show details
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

interface BannerImageProps {
  banner: IBannerDto;
}

export const BannerImage: FC<BannerImageProps> = ({ banner }) => {
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px) and (min-width: 481px)');
  const isDesktop = useMediaQuery('(min-width: 769px)');

  const image =
    (isDesktop && banner.desktopImage) ||
    (isTablet && banner.tabletImage) ||
    (isMobile && banner.mobileImage) ||
    banner.desktopImage ||
    banner.tabletImage ||
    banner.mobileImage;

  if (!image)
    return null;

  const thumbhash = image.thumbhash;
  const src = image.url;

  return (
    <UnLazyImageSSR
      autoSizes
      src={src}
      thumbhash={thumbhash}
      alt={banner.title || `banner-${banner.id}`}
      className="w-full h-full max-h-svh object-cover brightness-75 dark:brightness-65"
    />
  );
};

