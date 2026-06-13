import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getCategoryImage } from '../-consts/categories';
import { tm } from '../-lib/get-message';

interface IProps {
  categorySlug: string;
  categoryKey: string;
  hasImage?: boolean;
}

const CategoryHeader: FC<IProps> = ({ categorySlug, categoryKey, hasImage }) => {
  const base = `pages.public.products.${categoryKey}`;
  const title = tm(`${base}.title`);
  const subtitle = tm(`${base}.subtitle`);
  const description = tm(`${base}.description`);
  const cta = tm('pages.public.products.common.cta');

  const ctaButton = (
    <Button asChild className={cn('w-fit', hasImage && 'bg-white! text-black! hover:bg-white/90!')}>
      <a href="/#contact">{cta}</a>
    </Button>
  );

  return (
    <div className="space-y-8">
      {hasImage ? (
        <section className="relative overflow-hidden rounded-xl border border-border/50">
          <img
            src={getCategoryImage(categorySlug)}
            alt={title}
            loading="lazy"
            className="w-full h-[280px] md:h-[420px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10"/>
          <div className="absolute inset-0 flex flex-col justify-end gap-3 md:gap-4 p-6 md:p-10 text-white">
            <h1 className="text-3xl md:text-5xl font-bold max-w-3xl leading-tight">{title}</h1>
            <p className="text-sm md:text-lg text-white/85 max-w-2xl">{subtitle}</p>
            {ctaButton}
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-border/50 bg-muted/40 p-6 md:p-10 space-y-3 md:space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold max-w-3xl leading-tight">{title}</h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl">{subtitle}</p>
          {ctaButton}
        </section>
      )}

      {description && (
        <div className="max-w-3xl space-y-3 text-sm md:text-base text-muted-foreground">
          {description.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryHeader;
