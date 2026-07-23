import { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { m } from '@/paraglide/messages';


interface IProps extends ComponentProps<'section'> {
}

interface ICategoryCard {
  slug: string;
  title: string;
  subtitle: string;
  img: string;
  className?: string;
}

const SolutionList: FC<IProps> = ({ className, ...props }) => {
  const categories: ICategoryCard[] = [
    {
      slug: 'indoor',
      title: m['pages.public.solutions.indoor.title'](),
      subtitle: m['pages.public.solutions.indoor.subtitle'](),
      img: '/images/solutions/indoor/category.webp',
      className: 'md:row-span-2'
    },
    {
      slug: 'outdoor',
      title: m['pages.public.solutions.outdoor.title'](),
      subtitle: m['pages.public.solutions.outdoor.subtitle'](),
      img: '/images/solutions/outdoor/category.webp'
    },
    {
      slug: 'transparent',
      title: m['pages.public.solutions.transparent.title'](),
      subtitle: m['pages.public.solutions.transparent.subtitle'](),
      img: '/images/solutions/transparent/category.webp'
    },
    {
      slug: 'flexible',
      title: m['pages.public.solutions.flexible.title'](),
      subtitle: m['pages.public.solutions.flexible.subtitle'](),
      img: '/images/solutions/flexible/category.webp',
      className: 'md:col-span-2'
    }
  ];

  return (
    <section className={cn('space-y-8', className)} {...props}>
      <div>
        <h2 className="text-3xl font-bold">
          {m['pages.public.home.solutions.title']()}
        </h2>
        <p className="text-muted-foreground mt-2">
          {m['pages.public.home.solutions.subtitle']()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-2 md:gap-3 md:auto-rows-fr">
        {categories.map((cat) => (
          <CategoryCard key={cat.slug} {...cat}/>
        ))}
      </div>
    </section>
  );
};


const CategoryCard: FC<ICategoryCard> = ({ slug, title, subtitle, img, className }) => {
  return (
    <Link
      to="/solutions/$category"
      params={{ category: slug }}
      className={cn(
        'group relative flex min-h-52 flex-col justify-end overflow-hidden rounded-md border border-border/50',
        className
      )}
    >
      <img
        src={img}
        alt={title}
        loading="lazy"
        className={cn(
          'absolute inset-0 h-full w-full object-cover brightness-75',
          'transition duration-400 ease-in-out group-hover:scale-110 group-hover:brightness-50 group-focus:brightness-50'
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"/>
      <div className="relative space-y-1 p-4 text-white">
        <h3 className="text-lg font-bold uppercase">{title}</h3>
        <p className="text-sm text-white/85 line-clamp-2">{subtitle}</p>
      </div>
    </Link>
  );
};

export default SolutionList;
