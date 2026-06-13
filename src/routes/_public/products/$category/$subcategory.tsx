import { createFileRoute, notFound } from '@tanstack/react-router';
import { NotFoundCard } from '@/components/not-found-card';
import ProductDetail from '../-components/product-detail';
import ProductsBreadcrumb from '../-components/products-breadcrumb';
import { getSubcategory, getSubcategoryImage } from '../-consts/categories';
import { tm } from '../-lib/get-message';

export const Route = createFileRoute('/_public/products/$category/$subcategory')({
  component: RouteComponent,
  loader: ({ params: { category, subcategory } }) => {
    const result = getSubcategory(category, subcategory);
    if (!result) throw notFound();

    return result;
  },
  notFoundComponent: () => <NotFoundCard/>
});

function RouteComponent() {
  const { category, subcategory } = Route.useLoaderData();
  const baseKey = `pages.public.products.${category.key}.items.${subcategory.key}`;
  const title = tm(`${baseKey}.title`);
  const categoryTitle = tm(`pages.public.products.${category.key}.title`);

  return (
    <main className="container mx-auto px-4 pb-16 pt-6 space-y-8">
      <ProductsBreadcrumb
        crumbs={[
          { categorySlug: category.slug, label: categoryTitle },
          { label: title }
        ]}
      />

      <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>

      {category.hasImages && (
        <div className="grid sm:grid-cols-2 gap-4">
          <img
            src={getSubcategoryImage(category.slug, subcategory.slug, 1)}
            alt={title}
            loading="lazy"
            className="w-full h-auto rounded-xl border border-border/50 object-contain aspect-3/2 bg-muted/50"
          />
          <img
            src={getSubcategoryImage(category.slug, subcategory.slug, 2)}
            alt={title}
            loading="lazy"
            className="w-full h-auto rounded-xl border border-border/50 object-contain aspect-3/2 bg-muted/50"
          />
        </div>
      )}

      <ProductDetail baseKey={baseKey}/>
    </main>
  );
}
