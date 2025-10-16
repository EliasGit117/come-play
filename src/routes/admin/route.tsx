import { createFileRoute, Outlet } from '@tanstack/react-router';
import * as React from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/routes/admin/-components/sidebar/admin-sidebar';
import { Separator } from '@/components/ui/separator';
import AdminHeader from '@/routes/admin/-components/admin-header/header';


export const Route = createFileRoute('/admin')({
  component: AdminLayout,
  staticData: {
    breadcrumbs: [{ title: 'Admin' }]
  }
});

function AdminLayout() {

  return (
    <SidebarProvider>
      <AdminSidebar/>
      <SidebarInset className="overflow-hidden">
        <AdminHeader/>
        <Outlet/>
      </SidebarInset>
    </SidebarProvider>
  );
}

