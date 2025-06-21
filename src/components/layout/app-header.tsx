import { ComponentProps, FC } from 'react';
import { Link, LinkOptions } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ThemeDropdown } from '@/components/theme';
import { User } from 'better-auth';

interface IAppHeader extends ComponentProps<'header'> {
  user?: User;
}

const AppHeader: FC<IAppHeader> = ({ className, user, ...props }) => {
  const links = getLinks(user);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2" {...props}>
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

        <ThemeDropdown variant="ghost" size="smIcon" className="ml-auto"/>
      </div>
    </header>
  );
};

const getLinks: (user?: User) => (LinkOptions & { label: string; })[] = (user) => {
  const result: (LinkOptions & { label: string; })[] = [];
  result.push(
    { to: '/', label: 'Home' },
    { to: '/posts', label: 'Posts' },
    { to: '/users', label: 'Users' }
  );

  if (!!user) {
    result.push(
      { to: '/admin', label: 'Admin' },
    )
  } else {
    result.push(
      { to: '/auth/sign-in', label: 'Sign In' },
      { to: '/auth/sign-up', label: 'Sign Up' }
    )
  }

  return  result;
};

export default AppHeader;