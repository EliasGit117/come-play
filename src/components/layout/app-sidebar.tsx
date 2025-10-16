import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import * as React from 'react';
import { useAppSidebar } from './app-sidebar-provider';
import { headerLinks, ILinkItem, MenuItemType } from '@/components/layout/data';
import { FC } from 'react';

const AppSidebar = () => {
  const isOpen = useAppSidebar((s) => s.isOpen);
  const setOpen = useAppSidebar((s) => s.setOpen);

  const handleClick = () => setOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="sr-only">Navigation Links</SheetTitle>
          <SheetDescription className="sr-only">
            Navigate through the site using accordion groups and individual links
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 p-5 overflow-y-auto">
          <Accordion type="single" className="w-full" collapsible>
            {headerLinks.map((link, index) => {
              if (link.type === MenuItemType.Group) {
                return (
                  <AccordionItem
                    key={`group-${index}`}
                    value={`group-${index}`}
                    className="border-0"
                  >
                    <AccordionTrigger className="text-lg">
                      {link.title}
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 pt-2">
                      {link.items.map((item, subIndex) => (
                        <SidebarLink
                          key={`group-item-${index}-${subIndex}`}
                          item={item}
                          variant="ghost"
                          onClick={handleClick}
                          size="sm" // Smaller links inside accordion
                        />
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                );
              }

              if (link.type === MenuItemType.Single) {
                return (
                  <SidebarLink
                    key={`single-${index}`}
                    item={link.item}
                    variant="link"
                    onClick={handleClick}
                    size="md" // Normal sized link
                  />
                );
              }

              return null;
            })}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface ISidebarLinkProps {
  item: ILinkItem;
  variant?: 'link' | 'ghost';
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md';
}


const SidebarLink: FC<ISidebarLinkProps> = (props) => {
  const {
    item,
    variant = 'link',
    onClick,
    className,
    size = 'md',
  } = props;

  const labelClass = size === 'sm' ? 'text-sm font-medium' : 'text-lg font-medium';
  const descClass = size === 'sm' ? 'text-xs' : 'text-sm';
  const paddingClass = size === 'sm' ? 'p-1 px-2' : 'p-2';

  return (
    <Button
      size="dense"
      variant={variant}
      className={`justify-start h-fit w-full gap-0 ${paddingClass} ${className ?? ''}`}
      onClick={onClick}
      asChild
    >
      <Link to={item.linkOpt.to} className="flex flex-col items-start px-0">
        <span className={labelClass}>{item.label}</span>
        {item.description && (
          <span className={`${descClass} text-muted-foreground`}>{item.description}</span>
        )}
      </Link>
    </Button>
  );
};

export default AppSidebar;
