import { createFileRoute, Outlet } from '@tanstack/react-router';
import * as React from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/routes/admin/-components/sidebar/admin-sidebar';
import { Separator } from '@/components/ui/separator';


export const Route = createFileRoute('/admin')({
  component: AdminLayout
});

function AdminLayout() {

  return (
    <SidebarProvider>
      <AdminSidebar user={{ email: 'johndoe47@gmail.com', name: 'John Doe' }}/>
      <SidebarInset>
        <div className="container mx-auto px-4 py-2 flex gap-2 items-center">
          <SidebarTrigger className="-ml-1"/>
          <Separator orientation="vertical" className="max-h-4"/>
        </div>
        <Outlet/>
      </SidebarInset>
    </SidebarProvider>
  );
}

