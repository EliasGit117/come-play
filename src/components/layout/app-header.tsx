import { ComponentProps, FC } from 'react';
import { Link, LinkOptions } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ThemeDropdown } from '@/components/theme';

interface IAppHeader extends ComponentProps<'header'> {
}

const AppHeader: FC<IAppHeader> = ({ className, ...props }) => {

  return (
    <header className="flex items-center py-2" {...props}>
      <div className="container mx-auto px-4 flex gap-2 items-center">
        <nav className="flex gap-2 items-center">
          {links.map(({ label, ...props }, index) => (
            <Button
              size="sm"
              variant="link"
              data-first={index === 0}
              className="transition-none data-[first=true]:-ml-3"
              key={`${label}-${index}`}
              asChild
            >
              <Link activeProps={{ className: 'underline' }} {...props}>
                {label}
              </Link>
            </Button>
          ))}
        </nav>

        <ThemeDropdown variant="ghost" size="smIcon" className="ml-auto -mr-2.5"/>
      </div>
    </header>
  );
};

const links: (LinkOptions & { label: string; })[] = [
  { to: '/', label: 'Home' },
  { to: '/posts', label: 'Posts' },
  { to: '/users', label: 'Users' },
  { to: '/deferred', label: 'Deferred' },
];

export default AppHeader;