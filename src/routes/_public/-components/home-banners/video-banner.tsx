/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import { CarouselItem } from '@/components/ui/carousel';
import videoBanner from '/videos/home/banners/video-banner.mp4';
import videoPreview from '/images/home/banners/video-placeholder.webp';
import VideoPlaceholder from '@/components/video-placeholder';
import { cn } from '@/lib/utils';

export const VideoBanner = () => {

  return (
    <CarouselItem className="relative">
      <VideoPlaceholder
        placeholder={
          <img
            fetchPriority="high"
            src={videoPreview}
            alt="placeholder"
            className="min-h-[512px] h-full w-full max-h-svh object-cover"
          />
        }
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          className="min-h-[512px] h-full w-full max-h-svh object-cover brightness-50"
        >
          <source src={videoBanner} type="video/mp4"/>
        </video>
      </VideoPlaceholder>

      <div className={cn('absolute z-20 left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full')}>
        <div
          className="container mx-auto py-4 px-8 space-y-3 sm:space-y-4 lg:space-y-5 xl:space-y-6 text-white whitespace-pre-line">
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-semibold leading-tight">
            itc LED Display Solution
          </p>
        </div>
      </div>
    </CarouselItem>
  );
};