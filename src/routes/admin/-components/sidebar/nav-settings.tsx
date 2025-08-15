import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, useSidebar
} from '@/components/ui/sidebar';
import { ComponentPropsWithoutRef } from 'react';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';



const localeOptions = [
  { title: 'Romana', value: 'ro' },
  { title: 'Русский', value: 'ru' }
] as const;

interface IProps {
}


export function NavSettings({ ...props }: IProps & ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const locale = 'ro';
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>
        Settings
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>

          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <span>Language</span>
                  <span className="ml-auto text-muted-foreground uppercase text-xs">
                    {locale}
                  </span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuRadioGroup value={locale}>
                  <DropdownMenuLabel>Language selection</DropdownMenuLabel>
                  {localeOptions.map((item) =>
                    <DropdownMenuRadioItem
                      value={item.value}
                      onClick={() => {
                      }}
                    >
                      <span>{item.title}</span>
                    </DropdownMenuRadioItem>
                  )}

                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
