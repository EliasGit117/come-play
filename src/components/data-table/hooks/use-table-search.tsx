"use no memo";

import { useNavigate, useSearch } from '@tanstack/react-router';
import { ColumnDef, ColumnFiltersState, Updater } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';

type TTableSearchResult = [
  ColumnFiltersState,
  (updater: Updater<ColumnFiltersState>) => void
];

interface IUseTableSearchOptions {
  history?: "push" | "replace";
}

function getColumnId<TData>(col: ColumnDef<TData, any>): string {
  if (col.id) return col.id;
  if ("accessorKey" in col && col.accessorKey) {
    return String(col.accessorKey);
  }
  throw new Error("Column must have either id or accessorKey");
}

export function useTableSearch<TData>(
  columns: ColumnDef<TData, any>[],
  options?: IUseTableSearchOptions
): TTableSearchResult {
  const navigate = useNavigate();
  const search: Record<string, unknown> = useSearch({ strict: false });

  const { history = "replace" } = options ?? {};

  // Build lookup maps
  const { searchKeyToColumnId, columnIdToSearchKey } = useMemo(() => {
    const searchKeyToColumnId = new Map<string, string>();
    const columnIdToSearchKey = new Map<string, string>();

    for (const col of columns) {
      const searchKey = col.meta?.search?.key;
      if (searchKey) {
        const colId = getColumnId(col);
        searchKeyToColumnId.set(searchKey, colId);
        columnIdToSearchKey.set(colId, searchKey);
      }
    }

    return { searchKeyToColumnId, columnIdToSearchKey };
  }, [columns]);

  //  Convert router search → columnFilters
  const columnFilters: ColumnFiltersState = useMemo(
    () =>
      Object.entries(search)
        .filter(([key]) => searchKeyToColumnId.has(key))
        .map(([key, value]) => ({
          id: searchKeyToColumnId.get(key)!,
          value,
        })),
    [search, searchKeyToColumnId]
  );

  // Convert columnFilters → router search (without debounce)
  const setColumnFilters = useCallback(
    (updater: Updater<ColumnFiltersState>) => {
      const newFilters =
        typeof updater === "function" ? updater(columnFilters) : updater;

      const newSearch: Record<string, unknown> = {};

      // Collect all active search keys
      const activeSearchKeys = new Set<string>();
      for (const filter of newFilters) {
        const searchKey = columnIdToSearchKey.get(filter.id);
        if (searchKey) {
          newSearch[searchKey] = filter.value;
          activeSearchKeys.add(searchKey);
        }
      }

      // Ensure all searchable keys exist in search (set to undefined if cleared)
      for (const searchKey of columnIdToSearchKey.values()) {
        if (!activeSearchKeys.has(searchKey)) {
          newSearch[searchKey] = undefined;
        }
      }

      void navigate({
        to: ".",
        search: () => ({ ...search, ...newSearch, page: 1 }),
        replace: history === "replace",
      });
    },
    [columnFilters, search, columnIdToSearchKey, navigate, history]
  );

  return [columnFilters, setColumnFilters];
}
