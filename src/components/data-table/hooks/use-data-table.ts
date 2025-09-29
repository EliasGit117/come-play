import { useState } from 'react';
import { useDataTableSearch } from '@/components/data-table/hooks/use-data-table-search';
import {
  useReactTable,
  getCoreRowModel,
  TableOptions,
  VisibilityState, ColumnPinningState
} from '@tanstack/react-table';

interface IUseDataTableProps<TData> extends Omit<TableOptions<TData>,
  | 'state'
  | 'getCoreRowModel'
  | 'manualFiltering'
  | 'manualPagination'
  | 'manualSorting'
  | 'rowCount'
  | 'pageCount'
  | 'data'> {

  data?: TData[];
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  history?: 'push' | 'replace';
}


export function useDataTable<TData>(props: IUseDataTableProps<TData>) {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const {
    data: data = [],
    columns: columns = [],
    initialState,
    page = 1,
    total = 1,
    totalPages = 1,
    limit = 10,
    history = 'replace',
    ...tableProps
  } = props;

  const { columnFiltersState, setColumnFiltersState, sortingState, setSortingState } = useDataTableSearch({
    columns: columns
  });

  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(initialState?.columnPinning ?? {
    left: [],
    right: []
  });

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialState?.columnVisibility ?? {});

  const table = useReactTable({
    ...tableProps,
    data: data,
    columns: columns,

    defaultColumn: {
      filterFn: 'equals'
    },
    getCoreRowModel: getCoreRowModel(),

    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,

    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSortingState,
    onColumnFiltersChange: setColumnFiltersState,
    onColumnPinningChange: setColumnPinning,

    rowCount: total,
    pageCount: totalPages,
    state: {
      columnPinning: columnPinning,
      columnFilters: columnFiltersState,
      pagination: { pageIndex: page - 1, pageSize: limit },
      columnVisibility: columnVisibility,
      sorting: sortingState
    }
  });

  return { table, columnFiltersState, setColumnFiltersState };
}

