import { Column } from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowDownIcon,
  ArrowUp,
  ArrowUpIcon,
  ChevronsUpDown,
  EraserIcon,
  EyeOffIcon,
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
  title?: string;
  iconHidden?: boolean;
}

export function DataTableColumnHeader<TData, TValue>(props: DataTableColumnHeaderProps<TData, TValue>) {
  // noinspection BadExpressionStatementJS
  "use no memo";

  const { column, title: customTitle, className, iconHidden } = props;
  const isSorted = column.getIsSorted();
  const Icon = !iconHidden ? column.columnDef.meta?.icon : undefined;
  const title = customTitle ?? column.columnDef.meta?.label ?? column.id;

  if (!column.getCanSort()) {
    return (
      <div className={cn(className, 'flex items-center gap-2')}>
        {Icon && <Icon className="size-3.5 text-muted-foreground"/>}
        <span>{title}</span>
      </div>
    );
  }


  const toggleSorting = (value: boolean) => column.toggleSorting(value);
  const clearSorting = () => column.clearSorting();
  const hide = () => column.toggleVisibility(false);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent -ml-3 h-fit py-1 flex items-center gap-2"
          >
            {Icon && <Icon className="size-3.5 text-muted-foreground"/>}
            <span>{title}</span>
            {isSorted === 'desc' ? (
              <ArrowDownIcon/>
            ) : isSorted === 'asc' ? (
              <ArrowUpIcon/>
            ) : (
              <ChevronsUpDown/>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => toggleSorting(false)}>
            <ArrowUp/>
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toggleSorting(true)}>
            <ArrowDown/>
            Desc
          </DropdownMenuItem>

          {isSorted && (
            <DropdownMenuItem onClick={clearSorting}>
              <EraserIcon/>
              Clear
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator/>
          <DropdownMenuItem onClick={hide}>
            <EyeOffIcon/>
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
