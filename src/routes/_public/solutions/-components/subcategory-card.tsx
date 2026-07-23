import { FC } from 'react';
import { Link } from '@tanstack/react-router';
import { Card } from '@/components/ui/card';
import { getSubcategoryImage } from '../-consts/categories';
import { tm } from '../-lib/get-message';

interface IProps {
  categorySlug: string;
  categoryKey: string;
  subcategorySlug: string;
  subcategoryKey: string;
}

const SubcategoryCard: FC<IProps> = ({ categorySlug, categoryKey, subcategorySlug, subcategoryKey }) => {
  const baseKey = `pages.public.solutions.${categoryKey}.items.${subcategoryKey}`;
  const title = tm(`${baseKey}.title`);
  const description = tm(`${baseKey}.description`);
  const excerpt = description.split('\n\n')[0];

  return (
    <Link
      to="/solutions/$category/$subcategory"
      params={{ category: categorySlug, subcategory: subcategorySlug }}
      className="group"
    >
      <Card className="relative h-full p-0 gap-0 overflow-hidden border-border/50 transition-all hover:border-primary/50 aspect-3/2">
        <img
          alt={title}
          src={getSubcategoryImage(categorySlug, subcategorySlug, 1)}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition duration-400 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent"/>
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 text-white">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-xs text-white/85 line-clamp-3">{excerpt}</p>
        </div>
      </Card>
    </Link>
  );
};

export default SubcategoryCard;
