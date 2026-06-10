import { IconDeviceDesktop, IconLanguage, IconMoon, IconSun, IconSunMoon } from '@tabler/icons-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuSeparator,
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
import { useTheme } from '@/components/theme';

import { cn } from '@/lib/utils';


const localeOptions = [
  { title: 'Romana', value: 'ro' },
  { title: 'Русский', value: 'ru' }
] as const;

interface IProps {}


export function NavSettings({ ...props }: IProps & ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const locale = 'ro';
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();

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
                  <span>Theme</span>
                  <IconSun className='ml-auto text-muted-foreground dark:hidden'/>
                  <IconMoon className='ml-auto text-muted-foreground hidden dark:block'/>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={cn("w-(--radix-dropdown-menu-trigger-width) rounded-lg", !isMobile && 'w-44')}
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuRadioGroup value={theme}>
                  <DropdownMenuLabel className="flex gap-2 items-center">
                    <IconSunMoon className="size-4"/>
                    <span>Theme</span>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator/>

                  <DropdownMenuRadioItem value="light" onClick={() => setTheme('light')}>
                    <span>Light</span>
                    <IconSun className="ml-auto text-muted-foreground"/>
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value="dark" onClick={() => setTheme('dark')}>
                    <span>Dark</span>
                    <IconMoon className="ml-auto text-muted-foreground"/>
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value="system" onClick={() => setTheme('system')}>
                    <span>System</span>
                    <IconDeviceDesktop className="ml-auto text-muted-foreground"/>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

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
                className={cn("w-(--radix-dropdown-menu-trigger-width) rounded-lg", !isMobile && 'w-44')}
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuRadioGroup value={locale}>
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <IconLanguage className="size-4"/>
                    <span>Language</span>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator/>

                  {localeOptions.map(({ value, title }) =>
                    <DropdownMenuRadioItem
                      key={value}
                      value={value}
                      className="justify-between gap-4"
                    >
                      <span>{title}</span>
                      <span className="text-xs uppercase text-muted-foreground">
                        {value}
                      </span>
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