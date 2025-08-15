import { ComponentProps, FC, useEffect, useState } from 'react';
import { Link, useMatches } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { CalculatorIcon, MenuIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import HeaderNavMenu from '@/components/layout/nav-menu';
import LanguageDropdown from '@/components/layout/language-dropdown';
import { useAppSidebar } from '@/components/layout/app-sidebar-provider';
import LightLogo from 'public/icons/logo-white.svg?react';
import DarkLogo from 'public/icons/logo.svg?react';


interface IAppHeader extends ComponentProps<'header'> {
}

const AppHeader: FC<IAppHeader> = ({ className, ...props }) => {
  const matches = useMatches();
  const headerOptions = matches.find((match) => match.staticData.headerOptions)?.staticData.headerOptions;
  const { type } = headerOptions ?? { type: 'sticky' };
  const setOpenSidebar = useAppSidebar(s => s.setOpen);

  const [isAtTop, setIsAtTop] = useState(type !== 'sticky');


  useEffect(() => {
    if (type === 'sticky') {
      setIsAtTop(false);
      return;
    }

    const updateTopState = () => setIsAtTop(window.scrollY === 0);

    updateTopState(); // Run immediately on mount
    window.addEventListener('scroll', updateTopState, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateTopState);
    };
  }, [type]);


  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 bg-background',
        type === 'fixed' && 'fixed left-0 right-0',
        isAtTop && 'text-white bg-transparent'
      )}
      {...props}
    >
      <div className="container mx-auto px-4 flex gap-2 items-center">
        <Button variant="lightGhost" size="dense" className="-ml-1" asChild>
          <Link to="/">
            {isAtTop ? (
              <LightLogo className="size-8 xl:size-10"/>
            ) : (
              <DarkLogo className="size-8 xl:size-10"/>
            )}
          </Link>
        </Button>

        <HeaderNavMenu
          transparent={isAtTop}
          className="hidden xl:flex gap-2 xl:gap-8 items-center absolute left-1/2 -translate-x-1/2"
        />

        <div className="flex gap-2 items-center ml-auto">
          <LanguageDropdown buttonSize="icon" buttonVariant="ghost"/>

          <Button variant="ghost" size="icon" asChild>
            <Link to="/calculator">
              <CalculatorIcon/>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="xl:hidden" onClick={() => setOpenSidebar(true)}>
            <MenuIcon/>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;