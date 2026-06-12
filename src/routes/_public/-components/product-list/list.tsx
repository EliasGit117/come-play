import { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import indoorDisplayImg from '/images/home/products/indoor-display.webp';
import outdoorDisplayImg from '/images/home/products/outdoor-led-display.webp';
import rentalLedDisplayImg from '/images/home/products/rental-led-display.webp';
import transparentLedScreenImg from '/images/home/products/transparent-led-screen .webp';
import softLedScreenImg from '/images/home/products/soft-led-screen.webp';
import floorLedDisplay from '/images/home/products/floor-led-display.webp';
import UnLazyImageSSR from '@/components/un-lazy-image-ssr';
import { Card } from '@/components/ui/card';
import { m } from '@/paraglide/messages';


interface IProps extends ComponentProps<'section'> {
}

const ProductList: FC<IProps> = ({ className, ...props }) => {
  const products = [
    { id: 'indoor', title: m['pages.public.home.products.indoor'](), image: indoorDisplayImg, thumbhash: 'F7aFDQJFMK54hthreL+H+GyHWFh5d3BpmA==' },
    { id: 'outdoor', title: m['pages.public.home.products.outdoor'](), image: outdoorDisplayImg, thumbhash: 'ZNiFBQAkyAeHZ3tiFuaYD43ICXaGeHCcZg==' },
    { id: 'rental', title: m['pages.public.home.products.rental'](), image: rentalLedDisplayImg, thumbhash: 'KsaBDQIzeJZ4h4E9+HdngAcVB8iId4R7aA==' },
    { id: 'transparent', title: m['pages.public.home.products.transparent'](), image: transparentLedScreenImg, thumbhash: 'LviBBQAVE4m3nJL7Vmav4+/KKhiJh3GYCA==' },
    { id: 'soft', title: m['pages.public.home.products.soft'](), image: softLedScreenImg, thumbhash: 'oMWFDQQ1KPiHeXeLl0BiCCN2N1iIeIBqdw==' },
    { id: 'floor', title: m['pages.public.home.products.floor'](), image: floorLedDisplay, thumbhash: 'z/eBBQA0hE+HeIeHiF93CHpICKeId3WKWA==' }
  ];

  return (
    <section className={cn('space-y-8', className)} {...props}>
      <div>
        <h2 className="text-3xl font-bold">
          {m['pages.public.home.products.title']()}
        </h2>
        <p className="text-muted-foreground mt-2">
          {m['pages.public.home.products.subtitle']()}
        </p>
      </div>

      <div className={cn('grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6')}>
        {products.map((product) => (
          <article key={product.id}>
            <Link to="/">
              <Card
                className={cn(
                  'relative max-w-xs p-0 shadow-none h-52 bg-muted/50',
                  'border-border/50 justify-center items-center'
                )}
              >
                <UnLazyImageSSR
                  src={product.image}
                  alt={product.title}
                  thumbhash={product.thumbhash}
                  className="w-full h-full object-contain dark:brightness-75 max-h-38 max-w-38"
                />
              </Card>

              <h1 className="text-base font-semibold text-center pt-2">
                {product.title}
              </h1>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProductList;
