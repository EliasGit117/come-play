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
  hasImage?: boolean;
}

const SubcategoryCard: FC<IProps> = ({ categorySlug, categoryKey, subcategorySlug, subcategoryKey, hasImage }) => {
  const baseKey = `pages.public.products.${categoryKey}.items.${subcategoryKey}`;
  const title = tm(`${baseKey}.title`);
  const description = tm(`${baseKey}.description`);
  const excerpt = description.split('\n\n')[0];

  return (
    <Link
      to="/products/$category/$subcategory"
      params={{ category: categorySlug, subcategory: subcategorySlug }}
      className="group"
    >
      {hasImage ? (
        <Card className="relative h-full p-0 gap-0 overflow-hidden border-border/50 transition-all hover:border-primary/50 aspect-3/2">
          <img
            alt={title}
            src={getSubcategoryImage(categorySlug, subcategorySlug, 1)}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent"/>
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 text-white">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-xs text-white/85 line-clamp-3">{excerpt}</p>
          </div>
        </Card>
      ) : (
        <Card className="h-full p-4 gap-1 border-border/50 transition-all hover:border-primary/50">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-3">{excerpt}</p>
        </Card>
      )}
    </Link>
  );
};

export default SubcategoryCard;
