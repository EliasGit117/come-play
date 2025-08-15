import { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import firstProductImg from '/public/images/home/products/product-1.webp';
import secondProductImg from '/public/images/home/products/product-2.webp';
import thirdProductImg from '/public/images/home/products/product-3.webp';
import fourthProductImg from '/public/images/home/products/product-4.webp';
import fifthProductImg from '/public/images/home/products/product-5.webp';
import sixthProductImg from '/public/images/home/products/product-6.webp';
import UnLazyImageSSR from '@/components/un-lazy-image-ssr';


interface IProps extends ComponentProps<'section'> {}

const ProductList: FC<IProps> = ({ className, ...props }) => {

  return (
    <section
      className={cn('grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-4', className)}
      {...props}
    >

      {products.map((product) => (
        <article key={product.title} className="rounded-lg overflow-hidden relative">
          <Link to="/" className="overflow-hidden">
            <UnLazyImageSSR
              src={product.image}
              alt={product.title}
              className="w-full h-64 object-cover brightness-90"
              thumbhash={product.thumbhash}
            />
          </Link>
          <div className="absolute bottom-0 left-0 right-0 text-white p-2 md:p-4">
            <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
              {product.title}
            </h1>
          </div>

        </article>
      ))}
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