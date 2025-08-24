'use no memo';
'use client';
import { useDebouncedCallback } from 'use-debounce';
import { useCallback, useState } from 'react';
import {
  ColumnFiltersState,
  getCoreRowModel, SortingState,
  TableOptions,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { DEFAULT_DEBOUNCE } from '@/components/data-table/types/consts';

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
    columns,
    data = [],
    page = 1,
    total = 1,
    totalPages = 1,
    limit = 10,
    initialState
  } = props;

  // Local (controlled) table state - updates synchronously
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialState?.columnVisibility ?? {}
  );

  // Debounced sync function for external side-effects (URL, server, etc.)
  // Replace the body of this function with whatever external sync you need.
  const debouncedSyncFilters = useDebouncedCallback(
    (nextFilters: ColumnFiltersState) => {
      console.log('NEXT_FILTERS:', nextFilters);
      // Example placeholder:
      // setQueryParams({ filters: serializeFilters(nextFilters) })
      // or make an API call: fetchData({ filters: nextFilters })
      // For now, no-op or console.log
      // console.log("Syncing filters externally:", nextFilters);
    },
    DEFAULT_DEBOUNCE
  );

  // Synchronous handler for the table. Keeps UI responsive.
  const onColumnFiltersChange = useCallback((updaterOrValue: | ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState)) => {
      // Update local state immediately so table UI updates without delay
      setFiltering((prev) => {
        const next =
          typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue;
        // Trigger the debounced external sync with the new filters
        debouncedSyncFilters(next);

        return next;
      });
    },
    [debouncedSyncFilters]
  );

  const table = useReactTable({
    columns: columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),

    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,

    rowCount: total,
    pageCount: totalPages,

    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: onColumnFiltersChange,
    onSortingChange: setSorting,

    state: {
      columnVisibility: columnVisibility,
      pagination: { pageIndex: page - 1, pageSize: limit },
      columnFilters: filtering,
      sorting: sorting
    }
  });

  return {
    table: table,
    // expose helpers so callers can flush debounced sync if needed
    flushFilterSync: debouncedSyncFilters.flush,
    cancelFilterSync: debouncedSyncFilters.cancel
  };
}