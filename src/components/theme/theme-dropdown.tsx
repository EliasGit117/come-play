import { ComponentProps, FC } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from './provider';



interface IThemeDropdownProps extends ComponentProps<typeof Button> {
  align?: 'start' | 'center' | 'end';
}

export const ThemeDropdown: FC<IThemeDropdownProps> = ({ align, ...props }) => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" {...props}>
          <SunIcon className="dark:hidden"/>
          <MoonIcon className="hidden dark:block"/>
          <span className='sr-only'>
            Toggle theme dropdown
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align}>
        <DropdownMenuRadioGroup value={theme}>
          <DropdownMenuRadioItem value="light" onClick={() => setTheme('light')}>
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" onClick={() => setTheme('dark')}>
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" onClick={() => setTheme('system')}>
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>

    </DropdownMenu>
  );
};