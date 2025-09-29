import { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import firstProductImg from '/images/home/products/product-1.webp';
import secondProductImg from '/images/home/products/product-2.webp';
import thirdProductImg from '/images/home/products/product-3.webp';
import fourthProductImg from '/images/home/products/product-4.webp';
import fifthProductImg from '/images/home/products/product-5.webp';
import sixthProductImg from '/images/home/products/product-6.webp';
import UnLazyImageSSR from '@/components/un-lazy-image-ssr';
import { Card, CardContent } from '@/components/ui/card';


interface IProps extends ComponentProps<'section'> {
}

const ProductList: FC<IProps> = ({ className, ...props }) => {

  return (
    <section className={cn('space-y-8', className)} {...props}>
      <div className="text-center">
        <h2 className="text-3xl font-bold">
          PRODUCTS
        </h2>
        <p className="text-gray-500 mt-2">
          Discover the line of our products
        </p>
      </div>

      <div className={cn('grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6')}>
        {products.map((product) => (
          <article key={product.title}>
            <Link to="/">
              <Card className="relative max-w-xs p-0 shadow-none h-52 border-none overflow-clip">
                <CardContent className="rounded-none overflow-clip px-0 relative flex-1">
                  <UnLazyImageSSR
                    src={product.image}
                    alt={product.title}
                    thumbhash={product.thumbhash}
                    className="w-full h-full object-cover"
                  />
                </CardContent>
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

const products = [
  { title: 'Indoor LED Display', image: firstProductImg, thumbhash: 'tPcJFIT3SId5iXd8hIr4dYxv1w==' },
  { title: 'Outdoor LED Display', image: secondProductImg, thumbhash: 'tvcFHIL3OJd8iXd6hnn3dHpPpw==' },
  { title: 'Rental LED Display', image: thirdProductImg, thumbhash: 'tPcJFIL3OZd4iXd6hYj3cmY/lw==' },
  { title: 'Transparent LED Screen', image: fourthProductImg, thumbhash: 'tvcFFIT4R3h5inZ6hnn3dXtftw==' },
  { title: 'Soft LED Screen', image: fifthProductImg, thumbhash: 'tfcJHIL4V2h3ind8hYv3c1sPhg==' },
  { title: 'Floor LED Screen', image: sixthProductImg, thumbhash: '9ucFFIT4J7mMeId7dYj3d31/1w==' }
];

export default ProductList;
