import { createFileRoute } from '@tanstack/react-router'
import { HomeBanners } from './-components/home-banners';
import { ProductList } from './-components/product-list';
import { SolutionList } from './-components/solutions';
import { WriteAMessageSection } from './-components/write-a-message';
import LatestNews from '@/routes/_public/-components/latest-news';
import { orpc } from '@/lib/orpc';


export const Route = createFileRoute('/_public/')({
  component: RouteComponent,
  staticData: {
    headerOptions: { type: 'fixed' }
  },
  loader: async ({ context: { queryClient } }) => {
    const newsPromise = queryClient.prefetchQuery(orpc.news.latest.queryOptions());
    const bannersPromise = queryClient.ensureQueryData(orpc.banners.list.queryOptions());

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
