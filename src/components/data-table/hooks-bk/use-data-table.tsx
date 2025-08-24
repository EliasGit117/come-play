'use no memo';
'use client';
import { useMemo, useState } from 'react';
import {
  PaginationState,
  TableOptions,
  VisibilityState
} from '@tanstack/react-table';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useTableSort } from '@/components/data-table/hooks-bk/use-table-sort';
import { useTableSearch } from '@/components/data-table/hooks-bk/use-table-search';

interface IUseDataTableProps<TData>
  extends Omit<
    TableOptions<TData>,
    | 'state'
    | 'getCoreRowModel'
    | 'manualFiltering'
    | 'manualPagination'
    | 'manualSorting'
    | 'rowCount'
    | 'pageCount'
    | 'data'
  > {
  data?: TData[];
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  history?: 'push' | 'replace';
}

export function useDataTable<TData>(props: IUseDataTableProps<TData>) {
  const {
    data = [],
    columns,
    initialState,
    page = 1,
    total = 1,
    totalPages = 1,
    limit = 10,
    history = 'replace',
    ...tableProps
  } = props;

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialState?.columnVisibility ?? {}
  );

  // memoize pagination state so reference is stable between renders
  const paginationState = useMemo<PaginationState>(() => {
    return { pageIndex: page - 1, pageSize: limit };
  }, [page, limit]);

  const [sortingState, setSortingState] = useTableSort({ history });
  const [filters, setFilters] = useTableSearch(columns, { history });

  // memo defaultColumn (stable ref)
  const defaultColumn = useMemo(
    () => ({
      filterFn: 'equals' as const,
    }),
    []
  );

  const table = useReactTable({
    ...tableProps,
    columns,
    data,
    rowCount: total,
    initialState,
    pageCount: totalPages,

    defaultColumn,

    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,

    getCoreRowModel: getCoreRowModel(),

    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSortingState,
    onColumnFiltersChange: setFilters,

    state: {
      columnVisibility,
      sorting: sortingState,
      pagination: paginationState,
      columnFilters: filters,
    },
  });

  return { table };
}