"use no memo";

import { useNavigate, useSearch } from '@tanstack/react-router';
import { ColumnDef, ColumnFiltersState, Updater } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';
import { useDebouncedCallback } from 'use-debounce';

type TTableSearchResult = [ColumnFiltersState, (updater: Updater<ColumnFiltersState>) => void];

interface IUseTableSearchOptions {
  history?: 'push' | 'replace';
  debounceMs?: number;
}

export function useTableSearch<TData>(
  columns: ColumnDef<TData, any>[],
  options?: IUseTableSearchOptions
): TTableSearchResult {
  const navigate = useNavigate();
  const search: Record<string, unknown> = useSearch({ strict: false });

  const { history = 'replace', debounceMs = 300 } = options ?? {};

  const searchableColumnKeys = useMemo(
    () =>
      new Set(
        columns
          .filter(col => !!col.meta?.search?.key)
          .map(col => col.meta!.search!.key)
      ),
    [columns]
  );

  const columnFilters: ColumnFiltersState = useMemo(
    () =>
      Object.entries(search)
        .filter(([key]) => searchableColumnKeys.has(key))
        .map(([key, value]) => ({
          id: key,
          value
        })),
    [search, searchableColumnKeys]
  );

  const debouncedNavigate = useDebouncedCallback(
    (newSearch: Record<string, unknown>) => {
      void navigate({
        to: '.',
        search: () => ({ ...newSearch, page: 1 }),
        replace: history === 'replace'
      });
    },
    debounceMs
  );

  const setColumnFilters = useCallback(
    (updater: Updater<ColumnFiltersState>) => {
      const prevFilters: ColumnFiltersState = Object.entries(search).map(
        ([key, value]) => ({
          id: key,
          value
        })
      );

      const newFilters = typeof updater === 'function' ? updater(prevFilters) : updater;
      const newSearch: Record<string, unknown> = {};

      for (const filter of newFilters) {
        newSearch[filter.id] = filter.value;
      }

      searchableColumnKeys.forEach(key => (newSearch[key] ??= undefined));

      debouncedNavigate(newSearch);
    },
    [search, searchableColumnKeys, debouncedNavigate]
  );

  return [columnFilters, setColumnFilters];
}
