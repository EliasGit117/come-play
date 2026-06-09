import { ComponentProps, FC, useState, useEffect } from 'react';
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

interface IAppHeader extends ComponentProps<'header'> {
}

const AppHeader: FC<IAppHeader> = ({ className, ...props }) => {
  const setOpenSidebar = useAppSidebar((s) => s.setOpen);
  const matches = useMatches();
  const headerOptions = matches.find(
    (match) => match.staticData.headerOptions
  )?.staticData.headerOptions;
  const { type } = headerOptions ?? { type: 'sticky' };

  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useBodyScrollPosition(({ top }) => {
    if (!mounted) return;
    setIsAtTop(top);
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setIsAtTop(window?.scrollY === 0);

    const timer = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(timer);
  }, [mounted]);

  return (
    <>
      <header
        className={cn(
          // Visibility stage
          !mounted && 'sr-only',
          'sticky top-0 flex h-16 shrink-0 items-center gap-2 z-20',
          'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90',
          'dark:supports-[backdrop-filter]:bg-background/75 border-b',
          'transition-all duration-100 ease-out',
          type === 'fixed' && 'fixed left-0 right-0',
          entered ? 'opacity-150 translate-y-0' : 'opacity-0 -translate-y-4',
          isAtTop && '!bg-transparent border-b-transparent backdrop-blur-none',
          isAtTop && type === 'fixed' && 'text-white',
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-4 flex gap-2 items-center">
          <Button variant="lightGhost" size="dense" className="-ml-1" asChild>
            <Link to="/">
              {isAtTop && type === 'fixed' ? (
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
            <LanguageDropdown buttonVariant="ghost" align='end'/>
            <ThemeDropdown
              variant="ghost"
              className="ml-auto"
              size="icon-sm"
              align="end"
            />
            <Button variant="ghost" size="icon" className="transition-none" asChild>
              <Link to="/calculator">
                <CalculatorIcon/>
                <span className="sr-only">Calculation page</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              onClick={() => setOpenSidebar(true)}
            >
              <MenuIcon/>
              <span className="sr-only">Sidebar button</span>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};

export default AppHeader;