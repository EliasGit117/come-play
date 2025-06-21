import { useTheme } from '@/components/theme';
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
import { ComponentProps, ComponentPropsWithoutRef } from 'react';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';



// const localeOptions = [
//   { title: 'English', value: 'en' },
//   { title: 'Romana', value: 'ro' },
//   { title: 'Русский', value: 'ru' }
// ] as const;

interface IProps extends ComponentProps<typeof SidebarGroup> {}


export function AdminSidebarNavSettings({ ...props }: IProps & ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { theme, setTheme } = useTheme();
  const { isMobile } = useSidebar();

  const getIcon = () => {
    const className = 'ml-auto text-muted-foreground';

    switch (theme) {
      case 'light':
        return <SunIcon className={className}/>;
      case 'dark':
        return <MoonIcon className={className}/>;
      case 'system':
      default:
        return <MonitorIcon className={className}/>;
    }
  };

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
                  {getIcon()}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuRadioGroup value={theme}>
                  <DropdownMenuLabel>
                    Theme selection
                  </DropdownMenuLabel>
                  <DropdownMenuRadioItem value="light" onClick={() => setTheme('light')}>
                    <span>Light</span>
                    <SunIcon className="ml-auto text-muted-foreground"/>
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value="dark" onClick={() => setTheme('dark')}>
                    <span>Dark</span>
                    <MoonIcon className="ml-auto text-muted-foreground"/>
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value="system" onClick={() => setTheme('system')}>
                    <span>System</span>
                    <MonitorIcon className="ml-auto text-muted-foreground"/>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          {/*<SidebarMenuItem>*/}
          {/*  <DropdownMenu>*/}
          {/*    <DropdownMenuTrigger asChild>*/}
          {/*      <SidebarMenuButton>*/}
          {/*        <span>Language</span>*/}
          {/*        <span className="ml-auto text-muted-foreground uppercase text-xs">*/}
          {/*          {locale}*/}
          {/*        </span>*/}
          {/*      </SidebarMenuButton>*/}
          {/*    </DropdownMenuTrigger>*/}

          {/*    <DropdownMenuContent*/}
          {/*      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"*/}
          {/*      side={isMobile ? 'bottom' : 'right'}*/}
          {/*      align="end"*/}
          {/*      sideOffset={4}*/}
          {/*    >*/}
          {/*      <DropdownMenuRadioGroup value={locale}>*/}
          {/*        <DropdownMenuLabel>Language selection</DropdownMenuLabel>*/}
          {/*        {localeOptions.map((item) =>*/}
          {/*          <DropdownMenuRadioItem*/}
          {/*            value={item.value}*/}
          {/*            onClick={() => {*/}
          {/*              if (!isLocale(item.value))*/}
          {/*                return;*/}

          {/*              setLocale(item.value);*/}
          {/*            }}*/}
          {/*          >*/}
          {/*            <span>{item.title}</span>*/}
          {/*          </DropdownMenuRadioItem>*/}
          {/*        )}*/}

          {/*      </DropdownMenuRadioGroup>*/}
          {/*    </DropdownMenuContent>*/}
          {/*  </DropdownMenu>*/}
          {/*</SidebarMenuItem>*/}

        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
