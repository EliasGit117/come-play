import { IconCarouselHorizontal, IconHome, IconLayoutDashboard, IconNews, IconSettings, IconShoppingBag, IconShoppingCart, IconTag, IconTags } from '@tabler/icons-react';
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

import { INavItem } from '@/routes/admin/-components/sidebar/types/nav-item';
import { Link } from '@tanstack/react-router';
import { NavSettings } from '@/routes/admin/-components/sidebar/nav-settings';


interface IAdminSidebarProps extends ComponentProps<typeof Sidebar> {}

export function AdminSidebar({ ...props }: IAdminSidebarProps) {

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/admin">
                <IconShoppingCart className="!size-5" strokeWidth={2.5}/>
                <span className="text-base font-semibold">
                  {import.meta.env.VITE_APP_NAME ?? 'Website Name'}
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
    title: 'Home',
    linkOptions: { to: '/',  activeOptions: { exact: true } },
    icon: IconHome
  },
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
    title: 'News',
    linkOptions: { to: '/admin/news' },
    icon: IconNews
  },
  {
    title: 'Products',
    linkOptions: { to: '/admin/products' },
    icon: IconShoppingBag
  },
  {
    title: 'Categories',
    linkOptions: { to: '/admin/categories' },
    icon: IconTag
  },
  {
    title: 'Subcategories',
    linkOptions: { to: '/admin/subcategories' },
    icon: IconTags
  },
  {
    title: 'Settings',
    linkOptions: { to: '/' },
    icon: IconSettings
  }
];