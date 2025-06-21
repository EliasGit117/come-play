import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AdminSidebar } from '@/routes/admin/-components/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.userSession)
      throw redirect({ to: '/', replace: true });
  }
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AdminSidebar/>

      <SidebarInset asChild>
        <div>
          <header
            className={cn(
              'flex h-16 shrink-0 items-center gap-2',
              'transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'
            )}
          >
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1"/>
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4"/>

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Admin</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

          </header>

          <Outlet/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
