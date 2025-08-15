"use no memo";

import type { VariantProps } from 'class-variance-authority';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { useNavigate } from '@tanstack/react-router';
import { ComponentProps } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronsUpDownIcon } from 'lucide-react';
import { useDataTableContext } from '@/components/data-table';


interface IDataTablePaginationProps<TData> extends ComponentProps<'div'> {
  pageSizeOptions?: Array<number>;
  resetScroll?: boolean;
  buttonsSize?: VariantProps<typeof buttonVariants>['size'];
}


export function DataTablePagination<TData>(props: IDataTablePaginationProps<TData>) {
  const { table } = useDataTableContext<TData>();
  const {
    resetScroll,
    className,
    buttonsSize = 'smIcon',
    ...restOfProps
  } = props;

  const page = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  return (
    <div
      className={cn(cn('flex flex-col-reverse sm:flex-row gap-2 sm:gap-6 items-center', className))}
      {...restOfProps}
    >
      <p className="text-xs sm:text-sm">
        Rows per page
      </p>

      <PageLimitSelect value={table.getState().pagination.pageSize} buttonSize="sm" hideText/>

      <div className="flex-1"/>

      <p className="text-xs sm:text-sm">
        Page {page} of {totalPages}
      </p>

      <Pagination className="w-fit mx-0">
        <PaginationContent className="gap-2">
          <PaginationItem>
            <PaginationFirst
              to="."
              size={buttonsSize}
              disabled={!canPreviousPage}
              resetScroll={resetScroll}
              className="transition-none"
              search={(pv) => ({ ...pv, page: 1 })}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationPrevious
              to="."
              textHidden
              size={buttonsSize}
              disabled={!canPreviousPage}
              resetScroll={resetScroll}
              className="transition-none"
              search={(pv) => ({ ...pv, page: page - 1 })}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              to="."
              textHidden
              size={buttonsSize}
              disabled={!canNextPage}
              resetScroll={resetScroll}
              className="transition-none"
              search={(pv) => ({ ...pv, page: page + 1 })}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLast
              to="."
              size={buttonsSize}
              disabled={!canNextPage}
              resetScroll={resetScroll}
              className="transition-none"
              search={(pv) => ({ ...pv, page: totalPages })}
            />
          </PaginationItem>

        </PaginationContent>
      </Pagination>
    </div>
  );
}

interface IPageLimitSelectProps {
  value: number;
  className?: string;
  variants?: number[];
  hideText?: boolean;
  buttonSize?: 'default' | 'sm';
}

function PageLimitSelect(props: IPageLimitSelectProps) {
  const navigate = useNavigate();

  const {
    value,
    className,
    hideText,
    buttonSize = 'default',
    variants = [10, 25, 50, 100]
  } = props;

  const _onValueChange = (value: number) => {
    navigate({
      to: '.',
      resetScroll: false,
      search: (pv) => ({ ...pv, limit: value, page: 1 })
    }).then();
  };

    return (
      <div className={cn('flex gap-2 items-center', className)}>
        {!hideText && <p className="text-sm">Rows per page</p>}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={cn('min-w-20', buttonSize === 'default' ? 'max-h-9' : 'max-h-8')}>
              <span>{value.toString()}</span>
              <ChevronsUpDownIcon className="ml-auto"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Page</DropdownMenuLabel>
            {variants.map(page => (
              <DropdownMenuItem key={page} onSelect={() => _onValueChange(page)}>
                {page}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };
