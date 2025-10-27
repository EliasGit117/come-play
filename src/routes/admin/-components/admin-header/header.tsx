import { ComponentProps, useEffect, useRef } from 'react';
import * as React from 'react';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { BreadcrumbsNavigation } from '@/routes/admin/-components/admin-header/breadcrumb-nav';
import { cn } from '@/lib/utils';

interface IAdminHeaderProps extends ComponentProps<'header'> {
}

const AdminHeader: React.FC<IAdminHeaderProps> = ({ className, ...props }) => {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateTopState = () => {
      if (!headerRef.current) return;

      if (window.scrollY === 0) {
        headerRef.current.classList.add('!bg-transparent', 'backdrop-blur-none', 'border-b-transparent');
      } else {
        headerRef.current.classList.remove('!bg-transparent', 'backdrop-blur-none', 'border-b-transparent');
      }

      ticking = false;
    };

    const onScroll = () => {
      if (ticking)
        return;

      window.requestAnimationFrame(updateTopState);
      ticking = true;
    };

    updateTopState();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-0 border-b z-20',
        'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90',
        'dark:supports-[backdrop-filter]:bg-background/75',
        className
      )}
      {...props}
    >
      <div className="container mx-auto px-4 sm:py-0 flex gap-2 items-center h-12">
        <SidebarTrigger className="-ml-1"/>
        <Separator orientation="vertical" className="max-h-4"/>
        <BreadcrumbsNavigation/>
      </div>
    </header>
  );
};

export default AdminHeader;
