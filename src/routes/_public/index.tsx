import { createFileRoute } from '@tanstack/react-router'
import { HomeBanners } from './-components/home-banners';
import { ProductList } from './-components/product-list';
import { SolutionList } from './-components/solutions';
import { WriteAMessageSection } from './-components/write-a-message';
import LatestNews from '@/routes/_public/-components/latest-news';
import { getLatestNewsQueryOptions } from '@/features/news/server-functions/public/get-latest-news';
import { getBannersQueryOptions } from '@/features/banners/server-functions/public/get-banners';


export const Route = createFileRoute('/_public/')({
  component: RouteComponent,
  staticData: {
    headerOptions: { type: 'fixed' }
  },
  loader: async ({ context: { queryClient } }) => {
    const newsPromise = queryClient.prefetchQuery(getLatestNewsQueryOptions());
    const bannersPromise = queryClient.prefetchQuery(getBannersQueryOptions());

    return Promise.all([newsPromise, bannersPromise]);
  },
})

const containerClass = 'container mx-auto px-4';

function RouteComponent() {
  return (
    <main className='pb-16 space-y-16'>
      <HomeBanners/>
      <ProductList className={containerClass}/>
      <SolutionList className={containerClass}/>
      <WriteAMessageSection className={containerClass}/>
      <LatestNews className={containerClass}/>
    </main>
  )
}
