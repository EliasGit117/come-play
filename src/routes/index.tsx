import { createFileRoute } from '@tanstack/react-router'
import { HomeBanners } from '@/routes/-components/home-banners';
import { ProductList } from '@/routes/-components/product-list';
import { SolutionList } from '@/routes/-components/solutions';
import { WriteAMessageForm } from '@/routes/-components/write-a-message';

export const Route = createFileRoute('/')({
  component: RouteComponent,
  staticData: {
    headerOptions: {
      type: 'fixed'
    }
  }
})

function RouteComponent() {
  return (
    <main className='pb-16 space-y-16'>
      <HomeBanners/>
      <ProductList className='container mx-auto px-4'/>
      <SolutionList className='container mx-auto px-4'/>
      <section className='container mx-auto px-4'>
        <WriteAMessageForm/>
      </section>
    </main>
  )
}
