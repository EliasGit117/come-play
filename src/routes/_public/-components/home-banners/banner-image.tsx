import { FC } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import UnLazyImageSSR from '@/components/un-lazy-image-ssr';
import { IBannerBriefDto } from '@/features/banners/dtos/banner-brief-dto';
import { cn } from '@/lib/utils';

interface BannerImageProps {
  banner: IBannerBriefDto;
  className?: string;
}

export const BannerImage: FC<BannerImageProps> = ({ banner, className }) => {
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
      src={src}
      thumbhash={thumbhash}
      alt={banner.title ?? ''}
      className={cn('w-full h-svh object-cover brightness-75 dark:brightness-65', className)}
    />
  );
};

