import { IconDeviceDesktop, IconMoon, IconSun, IconSunMoon } from '@tabler/icons-react';
import type { TablerIcon } from '@tabler/icons-react';
import { type ComponentProps, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { TTheme, useTheme } from './provider';


interface IThemeDropdownProps extends ComponentProps<typeof Button> {
  align?: 'start' | 'center' | 'end';
}

const themeOptions: { label: () => string; value: TTheme; icon: TablerIcon; }[] = [
  { value: 'light', icon: IconSun, label: m['layout.theme.light'] },
  { value: 'dark', icon: IconMoon, label: m['layout.theme.dark'] },
  { value: 'system', icon: IconDeviceDesktop, label: m['layout.theme.system'] }
];

export const ThemeDropdown: FC<IThemeDropdownProps> = ({ align, className, ...props }) => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={cn('transition-none', className)} {...props}>
          <IconSun className="dark:hidden"/>
          <IconMoon className="hidden dark:block"/>
          <span className="sr-only">
            {m['layout.theme.sr_toggle']()}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='min-w-36' align={align}>
        <DropdownMenuRadioGroup value={theme}>
          <DropdownMenuLabel className="flex gap-2 items-center">
            <IconSunMoon className="size-4"/>
            <span>{m['layout.theme.label']()}</span>
          </DropdownMenuLabel>

          <DropdownMenuSeparator/>

          {themeOptions.map(({ icon: Icon, label, value }) =>
            <DropdownMenuRadioItem value={value} onClick={() => setTheme(value)} key={value}>
              <Icon className="text-muted-foreground"/>
              <span>{label()}</span>
              <div className="min-w-1 flex-1"/>
            </DropdownMenuRadioItem>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>

    </DropdownMenu>
  );
};
