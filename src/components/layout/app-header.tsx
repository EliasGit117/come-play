import { ComponentProps, FC, useState } from 'react';
import { Link, useMatches } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { CalculatorIcon, MenuIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import HeaderNavMenu from '@/components/layout/nav-menu';
import LanguageDropdown from '@/components/layout/language-dropdown';
import { useAppSidebar } from '@/components/layout/app-sidebar-provider';
import LightLogo from '@/assets/icons/logo-white.svg?react';
import DarkLogo from '@/assets/icons/logo.svg?react';
import { ThemeDropdown } from '@/components/theme';
import { useBodyScrollPosition } from '@n8tb1t/use-scroll-position';


interface IAppHeader extends ComponentProps<'header'> {}

const AppHeader: FC<IAppHeader> = ({ className, ...props }) => {
  const setOpenSidebar = useAppSidebar(s => s.setOpen);
  const matches = useMatches();
  const headerOptions = matches.find((match) => match.staticData.headerOptions)?.staticData.headerOptions;
  const { type } = headerOptions ?? { type: 'sticky' };

  const [isAtTop, setIsAtTop] = useState<boolean>(true);
  useBodyScrollPosition(({ top }) => setIsAtTop(top));

  return (
    <header
      className={cn(
        'sticky top-0 flex h-16 shrink-0 items-center gap-2 z-20',
        'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90',
        'dark:supports-[backdrop-filter]:bg-background/75 border-b',
        type === 'fixed' && 'fixed left-0 right-0',
        isAtTop && '!bg-transparent backdrop-blur-none border-b-transparent',
        (isAtTop && type === 'fixed') && 'text-white'
      )}
      {...props}
    >
      <div className="container mx-auto px-4 flex gap-2 items-center">
        <Button variant="lightGhost" size="dense" className="-ml-1" asChild>
          <Link to="/">
            {(isAtTop && type === 'fixed') ? (
              <LightLogo className="size-8 xl:size-10"/>
            ) : (
              <>
                <LightLogo className="size-8 xl:size-10 hidden dark:block"/>
                <DarkLogo className="size-8 xl:size-10 dark:hidden"/>
              </>
            )}
          </Link>
        </Button>

        <HeaderNavMenu
          transparent={isAtTop}
          className="hidden xl:flex gap-2 xl:gap-8 items-center absolute left-1/2 -translate-x-1/2"
        />

        <div className="flex gap-2 items-center ml-auto">
          <LanguageDropdown buttonSize="icon" buttonVariant="ghost"/>

          <ThemeDropdown variant="ghost" className="ml-auto" size="icon-sm" align="end"/>

          <Button variant="ghost" size="icon" className="transition-none" asChild>
            <Link to="/calculator">
              <CalculatorIcon/>
              <span className="sr-only">Calculation page</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="xl:hidden" onClick={() => setOpenSidebar(true)}>
            <MenuIcon/>
            <span className="sr-only">Sidebar button</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;