import { createFileRoute, notFound } from '@tanstack/react-router';
import { NotFoundCard } from '@/components/not-found-card';
import CategoryHeader from '../-components/category-header';
import ProductDetail from '../-components/product-detail';
import ProductsBreadcrumb from '../-components/products-breadcrumb';
import SubcategoryCard from '../-components/subcategory-card';
import { getCategory } from '../-consts/categories';
import { tm } from '../-lib/get-message';

export const Route = createFileRoute('/_public/products/$category/')({
  component: RouteComponent,
  loader: ({ params: { category } }) => {
    const config = getCategory(category);
    if (!config) throw notFound();

    return { config };
  },
  notFoundComponent: () => <NotFoundCard className='mx-auto'/>
});

function RouteComponent() {
  const { config } = Route.useLoaderData();
  const title = tm(`pages.public.products.${config.key}.title`);

  return (
    <main className="container mx-auto px-4 pb-16 pt-6 space-y-8 md:space-y-12">
      <ProductsBreadcrumb crumbs={[{ label: title }]}/>

      <CategoryHeader categorySlug={config.slug} categoryKey={config.key} hasImage={config.hasHeroImage ?? config.hasImages}/>

      {config.subcategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {config.subcategories.map((sub) => (
            <SubcategoryCard
              key={sub.slug}
              categorySlug={config.slug}
              categoryKey={config.key}
              subcategorySlug={sub.slug}
              subcategoryKey={sub.key}
              hasImage={config.hasImages}
            />
          ))}
        </div>
      ) : (
        <ProductDetail baseKey={`pages.public.products.${config.key}`} showDescription={false}/>
      )}
    </main>
  );
}
