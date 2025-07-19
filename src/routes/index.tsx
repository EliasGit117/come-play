import { createFileRoute } from '@tanstack/react-router'
import { HomeBanners } from '@/routes/-components/home-banners';

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
    <main>
      <HomeBanners/>
      <div className='h-[2000px]'/>
    </main>
  )
}
