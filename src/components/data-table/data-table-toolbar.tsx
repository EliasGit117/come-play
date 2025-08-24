'use client';
'use no memo';
import { DataTableSliderFilter } from './data-table-slider-filter';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableSort } from './data-table-sort';
import { ComponentProps, useCallback, useMemo } from 'react';
import { XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DataTableViewOptions } from './data-table-view-options';
import { type Column, Table as TanstackTable } from '@tanstack/react-table';
import { SearchInputType } from '@/components/data-table/types/filtration';
import { DataTableTextFilter } from './data-table-text-filter';
import * as React from 'react';


interface IDataTableToolbarProps<TData> extends ComponentProps<'div'> {
  table: TanstackTable<TData>;
}

export function DataTableToolbar<TData>(props: IDataTableToolbarProps<TData>) {
  const { table, children, className, ...restOfProps } = props;
  const isFiltered = table.getState().columnFilters.length > 0;
  const columns = useMemo(() => table.getAllColumns().filter((column) => column.getCanFilter()), [table]);
  const onReset = useCallback(() => table.resetColumnFilters(), [table]);

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
        <DataTableSort table={table}/>
        <DataTableViewOptions table={table}/>
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

  const onFilterRender = useCallback(() => {
    if (!columnMeta?.search)
      return null;

    switch (columnMeta.search.type) {
      case SearchInputType.Text:
        return <DataTableTextFilter column={column} key={column.id}  />;

      case SearchInputType.Number:
        return <DataTableTextFilter column={column} key={column.id} type='number'/>;

      case SearchInputType.NumberRange:
        return <DataTableSliderFilter column={column} key={column.id}/>;

      case SearchInputType.Select:
      case SearchInputType.MultiSelect:
        return (
          <DataTableFacetedFilter
            column={column}
            title={columnMeta.label ?? column.id}
            options={columnMeta.search.options ?? []}
            multiple={columnMeta.search.type === SearchInputType.MultiSelect}
            key={column.id}
          />
        );


      default:
        return null;
    }
  }, [column, columnMeta]);

  return onFilterRender();
}