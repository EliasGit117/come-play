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
import { m } from '@/paraglide/messages';


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
                  <LogoText className='h-3.5! w-20! text-foreground'/>
                  <span className='text-xs text-muted-foreground'>
                    {m['pages.admin.badge']()}
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavLinkGroup label={m['pages.admin.nav.main']()} items={getNavMain()}/>
        <div className="flex-1"/>
        <NavSettings/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  );
}

const getNavMain = (): INavItem[] => [
  {
    title: m['pages.admin.nav.dashboard'](),
    linkOptions: { to: '/admin', activeOptions: { exact: true } },
    icon: IconLayoutDashboard
  },
  {
    title: m['pages.admin.nav.banners'](),
    linkOptions: { to: '/admin/banners' },
    icon: IconCarouselHorizontal,
  },
  {
    title: m['pages.admin.nav.requests'](),
    linkOptions: { to: '/admin/customer-requests' },
    icon: IconInbox
  },
  {
    title: m['pages.admin.nav.news'](),
    linkOptions: { to: '/admin/news' },
    icon: IconNews
  }
];