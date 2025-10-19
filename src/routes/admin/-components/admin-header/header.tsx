import { ComponentProps } from 'react';
import * as React from 'react';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { BreadcrumbsNavigation } from '@/routes/admin/-components/admin-header/breadcrumb-nav';
import { cn } from '@/lib/utils';

interface IAdminHeaderProps extends ComponentProps<'header'> {}

const AdminHeader: React.FC<IAdminHeaderProps> = ({ className, ...props }) => {

  return (
    <header className={cn('container mx-auto px-4 py-2 flex gap-2 items-center', className)} {...props}>
      <SidebarTrigger className="-ml-1"/>
      <Separator orientation="vertical" className="max-h-4"/>
      <BreadcrumbsNavigation/>
    </header>
  );
};

export default AdminHeader;