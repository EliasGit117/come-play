import { IconCarouselHorizontal, IconInbox, IconLayoutDashboard, IconNews } from '@tabler/icons-react';
import { ComponentProps } from 'react';
import { NavLinkGroup } from './nav-link-group';
import { NavUser } from './nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import LogoIcon from '@/assets/icons/logo/icon.svg?react';
import LogoText from '@/assets/icons/logo/text.svg?react';
import { INavItem } from '@/routes/admin/-components/sidebar/types/nav-item';
import { Link } from '@tanstack/react-router';
import { NavSettings } from '@/routes/admin/-components/sidebar/nav-settings';


interface IAdminSidebarProps extends ComponentProps<typeof Sidebar> {}

export function AdminSidebar({ ...props }: IAdminSidebarProps) {

  return (
    <Sidebar variant='floating' collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5! h-10" asChild>
              <Link to="/" className='flex gap-2'>
                <LogoIcon className='size-7.5! text-foreground'/>
                <span className='flex flex-col'>
                  <LogoText className='h-3.5! w-fit! text-foreground'/>
                  <span className='text-xs text-muted-foreground'>
                    Admin
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavLinkGroup label="Main" items={navMain}/>
        <div className="flex-1"/>
        <NavSettings/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  );
}

const navMain: INavItem[] = [
  {
    title: 'Dashboard',
    linkOptions: { to: '/admin', activeOptions: { exact: true } },
    icon: IconLayoutDashboard
  },
  {
    title: 'Banners',
    linkOptions: { to: '/admin/banners' },
    icon: IconCarouselHorizontal,
  },
  {
    title: 'Requests',
    linkOptions: { to: '/admin/customer-requests' },
    icon: IconInbox
  },
  {
    title: 'News',
    linkOptions: { to: '/admin/news' },
    icon: IconNews
  }
];