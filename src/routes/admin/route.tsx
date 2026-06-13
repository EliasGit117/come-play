import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/routes/admin/-components/sidebar/admin-sidebar';
import AdminHeader from '@/routes/admin/-components/admin-header/header';
import { m } from '@/paraglide/messages';


export const Route = createFileRoute('/admin')({
  component: AdminLayout,
  staticData: { breadcrumbs: { title: m['pages.admin.breadcrumbs.root']() } },
  beforeLoad: ({ context }) => {
    if (!context.session || !context.user)
      throw redirect({ to: '/auth/sign-in' });

    if (context.user.role !== 'admin')
      throw redirect({ to: '/' });
  }
});

function AdminLayout() {

  return (
    <>
      <SidebarProvider>
        <AdminSidebar/>
        <SidebarInset className="min-w-0">
          <AdminHeader/>
          <Outlet/>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

