import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AppFooter, AppHeader, AppSidebar } from '@/components/layout';

export const Route = createFileRoute('/_public')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <AppHeader/>
      <AppSidebar/>
      <Outlet/>
      <AppFooter className='mt-auto'/>
    </>
  )
}
