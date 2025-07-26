import { createFileRoute } from '@tanstack/react-router'
import { HomeBanners } from '@/routes/-components/home-banners';
import { ProductList } from '@/routes/-components/product-list';
import { SolutionList } from '@/routes/-components/solutions';
import { WriteAMessageSection } from '@/routes/-components/write-a-message';


export const Route = createFileRoute('/')({
  component: RouteComponent,
  staticData: {
    headerOptions: {
      type: 'fixed'
    }
  }
})

const containerClass = 'container mx-auto px-4';

function RouteComponent() {
  return (
    <main className='pb-16 space-y-16'>
      <HomeBanners/>
      <ProductList className={containerClass}/>
      <SolutionList className={containerClass}/>
      <WriteAMessageSection className={containerClass}/>
    </main>
  )
}
