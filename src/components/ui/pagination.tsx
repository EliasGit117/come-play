import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { ComponentProps, forwardRef } from 'react';
import { Link, LinkProps } from '@tanstack/react-router';

const Pagination = ({ className, ...props }: ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = forwardRef<
  HTMLUListElement,
  ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = forwardRef<
  HTMLLIElement,
  ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type TPaginationLinkProps =
  { isActive?: boolean }
  & Pick<ComponentProps<typeof Button>, 'size' | 'className' | 'variant'>
  & LinkProps;

const PaginationLink = (props: TPaginationLinkProps) => {
  const { className, isActive, size = 'icon', variant, disabled, ...restOfProps } = props;

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        buttonVariants({ variant: !!variant ? variant : isActive ? 'outline' : 'ghost', size: size }),
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
      {...restOfProps}
    />
  );
};

PaginationLink.displayName = 'PaginationLink';

interface IPaginationPreviousProps extends ComponentProps<typeof PaginationLink> {
  textHidden?: boolean;
}

const PaginationPrevious = (props: IPaginationPreviousProps) => {
  const { className, textHidden, ...restOfProps } = props;

  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn(!textHidden && 'gap-1 pl-2.5', className)}
      {...restOfProps}
    >
      <ChevronLeft className="h-4 w-4"/>
      {!textHidden && <span>Previous</span>}
    </PaginationLink>
  );
};

PaginationPrevious.displayName = 'PaginationPrevious';


interface IPaginationFirstProps extends ComponentProps<typeof PaginationLink> {
  textHidden?: boolean;
}

const PaginationFirst = (props: IPaginationFirstProps) => {
  const { className, textHidden, ...restOfProps } = props;

  return (
    <PaginationLink
      aria-label="Go to first page"
      size="default"
      className={cn(!textHidden && 'gap-1 pl-2.5', className)}
      {...restOfProps}
    >
      {!textHidden && <span>First</span>}
      <ChevronsLeft className="h-4 w-4"/>
    </PaginationLink>
  );
};

PaginationFirst.displayName = 'PaginationFirst';

interface IPaginationNextProps extends ComponentProps<typeof PaginationLink> {
  textHidden?: boolean;
}

const PaginationNext = (props: IPaginationNextProps) => {
  const { className, textHidden, ...restOfProps } = props;

  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn(!textHidden && 'gap-1 pl-2.5', className)}
      {...restOfProps}
    >
      {!textHidden && <span>Next</span>}
      <ChevronRight className="h-4 w-4"/>
    </PaginationLink>
  );
};

PaginationNext.displayName = 'PaginationNext';

interface IPaginationLastProps extends ComponentProps<typeof PaginationLink> {
  textHidden?: boolean;
}

const PaginationLast = (props: IPaginationLastProps) => {
  const { className, textHidden, ...restOfProps } = props;

  return (
    <PaginationLink
      aria-label="Go to last page"
      size="default"
      className={cn(!textHidden && 'gap-1 pl-2.5', className)}
      {...restOfProps}
    >
      {!textHidden && <span>Last</span>}
      <ChevronsRight className="h-4 w-4"/>
    </PaginationLink>
  );
};

PaginationLast.displayName = 'PaginationLast';

const PaginationEllipsis = ({
                              className,
                              ...props
                            }: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4"/>
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationLast,
  PaginationFirst
};
