import { FC, ImgHTMLAttributes, useEffect } from 'react';
import type { UnLazyLoadOptions } from 'unlazy';
import { useRef, useState } from 'react';
import { lazyLoad } from 'unlazy';
import { createPngDataUri as createPngDataUriThumbhash } from '@unlazy/core/thumbhash';
import { createPngDataUri as createPngDataUriBlurhash } from '@unlazy/core/blurhash';

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
    loading = 'lazy',
    ...rest
  } = props;
  const target = useRef<HTMLImageElement | null>(null);

  const thumbhashSrc = thumbhash && createPngDataUriThumbhash(thumbhash);
  const blurhashSrc = blurhash && createPngDataUriBlurhash(blurhash);
  const placeholderSrc = thumbhashSrc ?? blurhashSrc;

  const [realSrc, setRealSrc] = useState<string | undefined>();

  useEffect(() => {
    if (!target.current) return;
    const cleanup = lazyLoad(target.current, {
      hash: thumbhash || blurhash,
      hashType: thumbhash ? 'thumbhash' : 'blurhash',
      placeholderSize
    });
    return () => cleanup();
  }, [thumbhash, blurhash, placeholderSize]);

  return (
    <img
      ref={target}
      alt={alt}
      src={realSrc ?? placeholderSrc}
      data-src={realSrc ? undefined : src}
      data-srcset={realSrc ? undefined : srcSet}
      data-sizes={autoSizes ? 'auto' : undefined}
      loading={loading}
      {...rest}
    />
  );
};

export default UnLazyImageSSR;
