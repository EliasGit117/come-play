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
import { m } from '@/paraglide/messages';


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
        {m['pages.admin.nav.settings']()}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <span>{m['pages.admin.theme.label']()}</span>
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
                    <span>{m['pages.admin.theme.label']()}</span>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator/>

                  <DropdownMenuRadioItem value="light" onClick={() => setTheme('light')}>
                    <IconSun className='text-muted-foreground'/>
                    <span>{m['pages.admin.theme.light']()}</span>
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value="dark" onClick={() => setTheme('dark')}>
                    <IconMoon className="text-muted-foreground"/>
                    <span>{m['pages.admin.theme.dark']()}</span>
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value="system" onClick={() => setTheme('system')}>
                    <IconDeviceDesktop className='text-muted-foreground'/>
                    <span>{m['pages.admin.theme.system']()}</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <span>{m['pages.admin.language.label']()}</span>
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
                    <span>{m['pages.admin.language.label']()}</span>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator/>

                  {localeOptions.map(({ value, title }) =>
                    <DropdownMenuRadioItem key={value} value={value}>
                      <span className="text-xs uppercase text-muted-foreground">
                        {value}
                      </span>
                      <span>{title}</span>
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