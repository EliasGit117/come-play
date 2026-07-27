import { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { Card } from '@/components/ui/card';
import { m } from '@/paraglide/messages';


interface IProps extends ComponentProps<'section'> {
}

const ProductList: FC<IProps> = ({ className, ...props }) => {
  const products = [
    { id: 'indoor', category: 'indoor', title: m['pages.public.home.products.indoor'](), image: '/images/products/indoor/category.webp' },
    { id: 'outdoor', category: 'outdoor', title: m['pages.public.home.products.outdoor'](), image: '/images/products/outdoor/category.webp' },
    { id: 'transparent', category: 'transparent', title: m['pages.public.home.products.transparent'](), image: '/images/products/transparent/category.webp' },
    { id: 'soft', category: 'soft', title: m['pages.public.home.products.soft'](), image: '/images/products/soft/category.webp' },
    { id: 'rental', category: 'rental', title: m['pages.public.home.products.rental'](), image: '/images/products/rental/category.webp' },
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

      <div className={cn('grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6')}>
        {products.map((product) => (
          <article key={product.id}>
            <Link to="/products/$category" params={{ category: product.category }}>
              <Card
                className={cn(
                  'relative max-w-xs p-0! shadow-none h-52 bg-muted/50',
                  'border-border/50 justify-center items-center'
                )}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  loading="lazy"
                  className="object-cover brightness-90 dark:brightness-75 size-full"
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
