import { ComponentProps } from 'react';
import * as React from 'react';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { BreadcrumbsNavigation } from '@/routes/admin/-components/admin-header/breadcrumb-nav';

interface IAdminHeaderProps extends ComponentProps<'header'> {}

const AdminHeader: React.FC<IAdminHeaderProps> = ({ ...props }) => {

  return (
    <div className="container mx-auto px-4 py-2 flex gap-2 items-center">
      <SidebarTrigger className="-ml-1"/>
      <Separator orientation="vertical" className="max-h-4"/>
      <BreadcrumbsNavigation/>
    </div>
  )
}

export default AdminHeader;