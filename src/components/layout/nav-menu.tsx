import { Link } from '@tanstack/react-router';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { ComponentProps, FC } from 'react';
import { headerLinks, ILinkItem, MenuItemType } from '@/components/layout/data';

interface IProps extends ComponentProps<typeof NavigationMenu> {
  transparent?: boolean;
}

const triggerAltClassName = cn(
  'bg-transparent !text-inherit',
  'hover:bg-accent/15 focus:bg-accent/15 data-[state=open]:hover:bg-accent/25 data-[state=open]:focus:bg-accent-15 data-[state=open]:bg-accent/15',
  'hover:text-accent-foreground focus:text-accent-foreground data-[state=open]:text-accent-foreground  focus-visible:ring-ring/50'
);


const HeaderNavMenu: FC<IProps> = ({ transparent, ...props }) => {
  const triggerClassName = transparent ? triggerAltClassName : '';

  return (
    <NavigationMenu viewport={false} {...props}>
      <NavigationMenuList>
        {headerLinks.map((menu, idx) =>
          menu.type === MenuItemType.Group ? (
            <DropdownMenu
              key={idx}
              title={menu.title}
              items={menu.items}
              triggerClassName={cn(triggerClassName, 'uppercase')}
            />
          ) : (
            <NavigationMenuItem key={idx}>
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), triggerClassName, 'uppercase')}
                asChild
              >
                <Link {...menu.item.linkOpt}>{menu.item.label}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};


interface IDropdownMenuProps extends ComponentProps<typeof NavigationMenuItem> {
  title: string;
  items: ILinkItem[];
  triggerClassName?: string;
}

const DropdownMenu: FC<IDropdownMenuProps> = ({ title, items, triggerClassName, ...props }) => (
  <NavigationMenuItem {...props}>
    <NavigationMenuTrigger className={triggerClassName}>{title}</NavigationMenuTrigger>
    <NavigationMenuContent>
      <ul className={cn('grid gap-2 w-[300px]', items.length > 4 && 'grid-cols-2 w-[400px]')}>
        {items.map((item, idx) => (
          <li key={idx}>
            <NavigationMenuLink asChild>
              <Link {...item.linkOpt}>
                <div className="font-medium">{item.label}</div>
                {item.description && (
                  <div className="text-muted-foreground text-xs">{item.description}</div>
                )}
              </Link>
            </NavigationMenuLink>
          </li>
        ))}
      </ul>
    </NavigationMenuContent>
  </NavigationMenuItem>
);


export default HeaderNavMenu;