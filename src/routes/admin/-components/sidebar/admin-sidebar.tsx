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
import { SettingsIcon, LayoutDashboardIcon, NewspaperIcon, ShoppingCartIcon } from 'lucide-react';
import { INavItem } from '@/routes/admin/-components/sidebar/types/nav-item';
import { Link } from '@tanstack/react-router';
import { NavSettings } from '@/routes/admin/-components/sidebar/nav-settings';


interface IUser {
  email: string;
  name: string;
}


interface IAdminSidebarProps extends ComponentProps<typeof Sidebar> {
  user: IUser;
}

export function AdminSidebar({ user, ...props }: IAdminSidebarProps) {
  if (!user)
    throw new Error('AppSidebar requires a user but received undefined.');

  const navMain: INavItem[] = [
    {
      title: 'Dashboard',
      linkOptions: { to: '/admin', activeOptions: { exact: true } },
      icon: LayoutDashboardIcon
    },
    {
      title: 'News',
      linkOptions: { to: '/admin/news' },
      icon: NewspaperIcon
    },
    {
      title: 'Settings',
      linkOptions: { to: '/' },
      icon: SettingsIcon
    }
  ];

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
                <ShoppingCartIcon className="!size-5" strokeWidth={2.5}/>
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
        {/*<NavSecondary items={navSecondary}/>*/}
        <div className="flex-1"/>
        <NavSettings/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user}/>
      </SidebarFooter>
    </Sidebar>
  );
}
