'use no memo';
'use client';
import { Column } from '@tanstack/react-table';
import {
  ArrowDown, ArrowDownIcon,
  ArrowUp,
  ArrowUpIcon,
  ChevronsUpDown,
  EraserIcon,
  EyeOffIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { HTMLAttributes } from 'react';

interface DataTableColumnHeaderProps<TData, TValue>
  extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>(props: DataTableColumnHeaderProps<TData, TValue>) {
  const { column, title, className } = props;
  const sorted = column.getIsSorted();

  if (!column.getCanSort())
    return <div className={cn(className)}>{title}</div>;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent -ml-3 h-fit py-1"
          >
            <span>{title}</span>
            {sorted === 'desc' ? <ArrowDownIcon/> : sorted === 'asc' ? <ArrowUpIcon/> : <ChevronsUpDown/>}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp/>
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown/>
            Desc
          </DropdownMenuItem>

          {column.getIsSorted() && (
            <DropdownMenuItem onClick={() => column.clearSorting()}>
              <EraserIcon/>
              Clear
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator/>
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOffIcon/>
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
