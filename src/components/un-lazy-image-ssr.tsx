import { FC, ImgHTMLAttributes, useEffect } from 'react';
import type { UnLazyLoadOptions } from 'unlazy';
import { useRef } from 'react';
import { lazyLoad } from 'unlazy';
import { createPngDataUri as createPngDataUriThumbhash } from '@unlazy/core/thumbhash';
import { createPngDataUri as createPngDataUriBlurhash } from '@unlazy/core/blurhash';
import { cn } from '@/lib/utils';

interface IProps
  extends ImgHTMLAttributes<HTMLImageElement>,
    Pick<UnLazyLoadOptions, 'placeholderSize'> {
  src?: ImgHTMLAttributes<HTMLImageElement>['src'];
  srcSet?: ImgHTMLAttributes<HTMLImageElement>['srcSet'];
  autoSizes?: boolean;
  blurhash?: string;
  thumbhash?: string;
  loading?: ImgHTMLAttributes<HTMLImageElement>['loading'];
}

const UnLazyImageSSR: FC<IProps> = (props) => {
  const {
    src,
    srcSet,
    alt,
    autoSizes,
    blurhash,
    thumbhash,
    placeholderSize,
    className,
    loading = 'lazy',
    ...rest
  } = props;

  const target = useRef<HTMLImageElement | null>(null);
  const thumbhashSrc = thumbhash && createPngDataUriThumbhash(thumbhash);
  const blurhashSrc = blurhash && createPngDataUriBlurhash(blurhash);
  const placeholderSrc = thumbhashSrc ?? blurhashSrc;


  useEffect(() => {
    if (!target.current)
      return;

    const cleanup = lazyLoad(target.current, {
      hash: thumbhash || blurhash,
      hashType: thumbhash ? 'thumbhash' : 'blurhash',
      placeholderSize,
      onImageLoad: () => {
        target.current?.classList.remove('safari:blur-xs', 'safari:scale-105');
      }
    });

    return () => cleanup();
  }, [src, srcSet, autoSizes, blurhash, thumbhash, placeholderSrc, placeholderSize]);

  return (
    <img
      ref={target}
      alt={alt}
      src={placeholderSrc}
      data-src={src}
      data-srcset={src}
      data-sizes={autoSizes ? 'auto' : undefined}
      loading={loading}
      className={cn('safari:blur-xs safari:scale-105', className)}
      {...rest}
    />
  );
};

export default UnLazyImageSSR;
