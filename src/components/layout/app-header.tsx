import { IconCalculator, IconMenu2 } from '@tabler/icons-react';
import { ComponentProps, FC, useState, useEffect } from 'react';
import { Link, useMatches } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import HeaderNavMenu from '@/components/layout/nav-menu';
import LocaleDropdown from '@/components/layout/locale-dropdown';
import { useAppSidebar } from '@/components/layout/app-sidebar-provider';
import LogoFull from '@/assets/icons/logo/full.svg?react';
import { ThemeDropdown } from '@/components/theme';
import { useBodyScrollPosition } from '@n8tb1t/use-scroll-position';
import { m } from '@/paraglide/messages';


interface IAppHeader extends ComponentProps<'header'> {}

const AppHeader: FC<IAppHeader> = ({ className, ...props }) => {
  const setOpenSidebar = useAppSidebar((s) => s.setOpen);
  const matches = useMatches();
  const hasError = matches.some((match) => match.status === 'error');
  const headerOptions = matches.find(
    (match) => match.staticData.headerOptions
  )?.staticData.headerOptions;
  // Force sticky on error so the fixed/transparent header never overlaps the
  // error boundary rendered in the content area.
  const type = hasError ? 'sticky' : (headerOptions?.type ?? 'sticky');

  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  // Transparent header only makes sense over a fixed hero, never over an error
  // boundary or a regular sticky page.
  const isTransparent = isAtTop && type === 'fixed';

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
          'bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/90',
          'dark:supports-backdrop-filter:bg-background/75 border-b',
          'transition-all duration-100 ease-out',
          type === 'fixed' && 'fixed left-0 right-0',
          entered ? 'opacity-150 translate-y-0' : 'opacity-0 -translate-y-4',
          isAtTop && 'border-b-transparent',
          isTransparent && 'bg-transparent! backdrop-blur-none text-white',
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-4 flex gap-2 items-center">
          <Button size="lg" variant="link" className="-ml-1" asChild>
            <Link to="/">
              <LogoFull
                className={cn(
                  'h-8! w-36! text-foreground -ml-5',
                  isTransparent && 'text-white'
                )}
              />
            </Link>
          </Button>

          <HeaderNavMenu
            transparent={isTransparent}
            className="hidden lg:flex gap-8 items-center absolute left-1/2 -translate-x-1/2"
          />

          <div className="flex gap-2 items-center ml-auto">
            <LocaleDropdown buttonVariant="ghost" align="end"/>
            <ThemeDropdown
              variant="ghost"
              className="ml-auto"
              size="icon-sm"
              align="end"
            />
            <Button variant="ghost" size="icon" className="transition-none" asChild>
              <Link to="/calculator">
                <IconCalculator/>
                <span className="sr-only">{m['layout.header.sr.calculator']()}</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpenSidebar(true)}
            >
              <IconMenu2/>
              <span className="sr-only">{m['layout.header.sr.menu']()}</span>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};

export default AppHeader;