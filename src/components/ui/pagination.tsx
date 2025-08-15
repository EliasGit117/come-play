import * as React from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontalIcon
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Link, type LinkProps } from '@tanstack/react-router';
import type { VariantProps } from 'class-variance-authority';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from './select';
import { useIsMobile } from '@/hooks/use-mobile';


function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent(props: React.ComponentProps<'ul'>) {
  const { className, ...restOfProps } = props;

  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex flex-row items-center gap-1', className)}
      {...restOfProps}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  className?: string;
  size?: VariantProps<typeof buttonVariants>['size'];
  variant?: VariantProps<typeof buttonVariants>['variant'];
  activeVariant?: VariantProps<typeof buttonVariants>['variant'];
} & Omit<LinkProps, 'className'> & LinkProps;


function PaginationLink(props: PaginationLinkProps) {
  const {
    className,
    isActive,
    size = 'icon',
    variant = 'outline',
    activeVariant = 'default',
    disabled,
    ...restOfProps
  } = props;

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      className={cn(
        buttonVariants({ variant: isActive ? activeVariant : variant, size }),
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      {...restOfProps}
    />
  );
}

function PaginationPrevious(props: PaginationLinkProps & { textHidden?: boolean }) {
  const { className, textHidden, ...restOfProps } = props;

  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      {...restOfProps}
    >
      <ChevronLeftIcon/>
      <span
        data-text-hidden={true}
        className="hidden sm:block data-[text-hidden=true]:hidden"
      >
        Previous
      </span>
    </PaginationLink>
  );
}

function PaginationFirst(props: PaginationLinkProps & { textShown?: boolean }) {
  const { className, textShown, ...restOfProps } = props;

  return (
    <PaginationLink
      aria-label="Go to first page"
      size="default"
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      {...restOfProps}
    >
      <ChevronsLeftIcon/>
      <span data-text-shown={textShown} className="hidden sm:data-[text-shown=true]:block">
        First page
      </span>
    </PaginationLink>
  );
}


function PaginationNext(props: PaginationLinkProps & { textHidden?: boolean }) {
  const { className, textHidden, ...restOfProps } = props;

  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
      {...restOfProps}
    >
      <span
        data-text-hidden={true}
        className="hidden sm:block data-[text-hidden=true]:hidden"
      >
        Next
      </span>
      <ChevronRightIcon/>
    </PaginationLink>
  );
}


function PaginationLast(props: PaginationLinkProps & { textShown?: boolean }) {
  const { className, textShown, ...restOfProps } = props;

  return (
    <PaginationLink
      aria-label="Go to last page"
      size="default"
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      {...restOfProps}
    >
      <ChevronsRightIcon/>
      <span data-text-shown={textShown} className="hidden sm:data-[text-shown=true]:block">
        Last page
      </span>
    </PaginationLink>
  );
}


function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4"/>
      <span className="sr-only">
        More pages
      </span>
    </span>
  );
}


interface IPaginatorProps {
  page: number;
  totalPages: number;
  className?: string;
  resetScroll?: boolean;
}

function Paginator({ className, page, totalPages, resetScroll }: IPaginatorProps) {
  const isMobile = useIsMobile();

  const pages = getPaginationList({
    page: page,
    totalPages: totalPages,
    maxItemCount: isMobile ? 7 : 9
  });


  return (
    <div className={className}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              to="."
              textHidden
              disabled={page <= 1}
              resetScroll={resetScroll}
              search={(pv: Record<string, unknown>) => ({ ...pv, page: page - 1 })}
            />
          </PaginationItem>

          {pages.map((p, idx) => (
            <PaginationItem key={idx}>
              {p === -1 ? (
                <PaginationEllipsis/>
              ) : (
                <PaginationLink
                  to="."
                  resetScroll={resetScroll}
                  search={(pv: Record<string, unknown>) => ({ ...pv, page: p })}
                  className={cn('transition-none', isMobile && 'text-xs')}
                  isActive={p === page}
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              to="."
              textHidden
              disabled={page >= totalPages}
              resetScroll={resetScroll}
              search={(pv: Record<string, unknown>) => ({ ...pv, page: page + 1 })}
            />
          </PaginationItem>

        </PaginationContent>
      </Pagination>
    </div>
  );
}


interface IGetPaginationListParams {
  page: number;
  totalPages: number;
  maxItemCount: number;
}

function getPaginationList(params: IGetPaginationListParams): number[] {
  const { page, totalPages, maxItemCount } = params;
  if (totalPages <= 0) return [];
  if (totalPages <= maxItemCount) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const nearBeginningThreshold = Math.ceil(maxItemCount / 2);
  const nearEndThreshold = totalPages - Math.ceil(maxItemCount / 2) + 1;

  const result = [];

  if (page <= nearBeginningThreshold) {
    for (let i = 1; i <= maxItemCount - 2; i++) {
      result.push(i);
    }
    result.push(-1);
    result.push(totalPages);
    return result;
  }

  if (page >= nearEndThreshold) {
    result.push(1);
    result.push(-1);
    for (let i = totalPages - (maxItemCount - 3); i <= totalPages; i++) {
      result.push(i);
    }
    return result;
  }

  result.push(1);
  result.push(-1);

  const middleCount = maxItemCount - 4;

  const halfMiddle = Math.floor(middleCount / 2);
  const middleStart = Math.max(2, page - halfMiddle);
  const middleEnd = Math.min(totalPages - 1, middleStart + middleCount - 1);

  for (let i = middleStart; i <= middleEnd; i++) {
    result.push(i);
  }

  result.push(-1);
  result.push(totalPages);
  return result;
}


interface IPageSizeSelectProps {
  value: number;
  onValueChange: (value: number) => void;
  className?: string;
  variants?: number[];
  hideText?: boolean;
  buttonSize?: 'default' | 'sm';
}

function PageSizeSelect(props: IPageSizeSelectProps) {
  const {
    value,
    onValueChange,
    className,
    hideText,
    buttonSize = 'default',
    variants = [10, 25, 50, 100]
  } = props;

  const _onValueChange = (value: string) => {
    onValueChange(parseInt(value));
  };

  return (
    <div className={cn('flex gap-2 items-center', className)}>
      {
        !hideText &&
        <p className='text-sm'>
          Rows per page
        </p>
      }

      <Select value={value.toString()} onValueChange={_onValueChange}>
        <SelectTrigger className={cn("min-w-20", buttonSize === 'default' ? 'max-h-9' : 'max-h-8')}>
          <SelectValue placeholder="Select page size" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>
              Page size
            </SelectLabel>
            {
              variants.map(variant => (
                <SelectItem value={variant.toString()} key={variant}>
                  {variant}
                </SelectItem>
              ))
            }
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

interface ITablePaginationProps {
  page: number;
  pageSize: number;
  totalPages: number;
  onSizeChange: (value: number) => void;
  resetScroll?: boolean;
  className?: string;
  buttonsSize?: VariantProps<typeof buttonVariants>['size']
}

function DataTablePagination(props: ITablePaginationProps) {
  const {
    page,
    totalPages,
    resetScroll,
    pageSize,
    onSizeChange,
    className,
    buttonsSize = 'smIcon'
  } = props;

  return (
    <div className={cn(cn('flex flex-col-reverse sm:flex-row gap-2 sm:gap-6 items-center', className))}>
      <p className='text-xs sm:text-sm'>
        Rows per page
      </p>

      <PageSizeSelect value={pageSize} onValueChange={onSizeChange} buttonSize='sm' hideText/>

      <div className='flex-1'/>

      <p className='text-xs sm:text-sm'>
        Page {page} of {totalPages}
      </p>

      <Pagination className='w-fit mx-0'>
        <PaginationContent className='gap-2'>
          <PaginationItem>
            <PaginationFirst
              to="."
              size={buttonsSize}
              disabled={page <= 1}
              resetScroll={resetScroll}
              className='transition-none'
              search={(pv: Record<string, unknown>) => ({ ...pv, page: 1 })}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationPrevious
              to="."
              textHidden
              size={buttonsSize}
              disabled={page <= 1}
              resetScroll={resetScroll}
              className='transition-none'
              search={(pv: Record<string, unknown>) => ({ ...pv, page: page - 1 })}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              to="."
              textHidden
              size={buttonsSize}
              disabled={page >= totalPages}
              resetScroll={resetScroll}
              className='transition-none'
              search={(pv: Record<string, unknown>) => ({ ...pv, page: page + 1 })}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLast
              to="."
              size={buttonsSize}
              disabled={page >= totalPages}
              resetScroll={resetScroll}
              className='transition-none'
              search={(pv: Record<string, unknown>) => ({ ...pv, page: totalPages })}
            />
          </PaginationItem>

        </PaginationContent>
      </Pagination>
    </div>
  )
}


export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  Paginator,
  PageSizeSelect,
  DataTablePagination,
  getPaginationList,
};
