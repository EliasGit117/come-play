import { ComponentProps, FC, useEffect, useState } from 'react';
import { Link, LinkOptions, useMatches } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { CalculatorIcon, LanguagesIcon, MenuIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import HeaderNavMenu from '@/components/layout/nav-menu';

interface IAppHeader extends ComponentProps<'header'> {
}

const AppHeader: FC<IAppHeader> = ({ className, ...props }) => {
  const matches = useMatches();
  const headerOptions = matches.find((match) => match.staticData.headerOptions)?.staticData.headerOptions;
  const { type } = headerOptions ?? { type: 'sticky' };

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
        <Button variant="lightGhost" size="dense" className="p-2 -ml-2" asChild>
          <Link to="/">
            <img
              alt="logo"
              src={isAtTop ? 'public/icons/logo-white.svg' : 'public/icons/logo.svg'}
              className="h-6 xl:h-10"
            />
          </Link>
        </Button>

        <HeaderNavMenu
          transparent={isAtTop}
          className="hidden lg:flex gap-2 xl:gap-8 items-center absolute left-1/2 -translate-x-1/2"
        />

        <div className="flex gap-2 items-center ml-auto">
          <Button variant="ghost" size="icon">
            <LanguagesIcon/>
          </Button>

          <Button variant="ghost" size="icon">
            <CalculatorIcon/>
          </Button>

          <Button variant="ghost" size="icon" className="xl:hidden">
            <MenuIcon/>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;