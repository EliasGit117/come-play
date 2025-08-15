"use no memo";

import {
  PaginationState,
  TableOptions,
  VisibilityState
} from '@tanstack/react-table';
import { useState } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useTableSort } from '@/components/data-table/hooks/use-table-sort';
import { useTableSearch } from '@/components/data-table/hooks/use-table-search';


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
  const {
    data: data = [],
    columns,
    initialState,
    page = 1,
    total = 1,
    totalPages = 1,
    limit = 10,
    history = 'replace',
    ...tableProps
  } = props;

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialState?.columnVisibility ?? {});
  const paginationState: PaginationState = { pageIndex: page - 1, pageSize: limit };
  const [sortingState, setSortingState] = useTableSort({ history: history });
  const [filters, setFilters] = useTableSearch(columns, { history: history });

  const table = useReactTable({
    ...tableProps,
    columns,
    data: data,
    rowCount: total,
    initialState: initialState,
    pageCount: totalPages,

    defaultColumn: {
      filterFn: 'equals',
    },

    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,

    getCoreRowModel: getCoreRowModel(),

    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSortingState,
    onColumnFiltersChange: setFilters,

    state: {
      columnVisibility: columnVisibility,
      sorting: sortingState,
      pagination: paginationState,
      columnFilters: filters
    }
  });

  return { table };
}