"use no memo";

import * as React from 'react';
import { XIcon } from 'lucide-react';
import type { Column } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DataTableTextFilter } from '@/components/data-table/components/data-table-text-filter';
import { DataTableViewOptions, useDataTableContext } from '@/components/data-table';
import { SearchInputType } from '@/components/data-table/types/filtration';
import { DataTableSliderFilter } from '@/components/data-table/components/data-table-slider-filter';



interface IDataTableToolbarProps<TData> extends React.ComponentProps<'div'> {}

export function DataTableToolbar<TData>(props: IDataTableToolbarProps<TData>) {
  const { table } = useDataTableContext<TData>();
  const { children, className, ...restOfProps } = props;
  const isFiltered = table.getState().columnFilters.length > 0;

  const columns = React.useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table]
  );

  const onReset = React.useCallback(() => {
    table.resetColumnFilters();
  }, [table]);

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        'flex w-full items-start justify-between gap-2 py-1',
        className
      )}
      {...restOfProps}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {columns.map((column) => (
          <DataTableToolbarFilter key={column.id} column={column}/>
        ))}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="outline"
            size="sm"
            className="border-dashed"
            onClick={onReset}
          >
            <XIcon/>
            Reset
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions/>
      </div>
    </div>
  );
}

interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>;
}

function DataTableToolbarFilter<TData>(props: DataTableToolbarFilterProps<TData>) {
  const { column } = props;
  const columnMeta = column.columnDef.meta;

  const onFilterRender = React.useCallback(() => {
    if (!columnMeta?.search)
      return null;

    switch (columnMeta.search.type) {
      case SearchInputType.Text:
        return <DataTableTextFilter column={column}/>;

      case SearchInputType.Number:
        return <DataTableTextFilter type='number' column={column}/>;

      case SearchInputType.NumberRange:
        return <DataTableSliderFilter column={column}/>;

      default:
        return null;
    }
  }, [column, columnMeta]);

  return onFilterRender();
}

