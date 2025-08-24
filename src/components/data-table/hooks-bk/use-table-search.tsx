'use no memo';
'use client';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { ColumnDef, ColumnFiltersState, Updater } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';

type TTableSearchResult = [
  ColumnFiltersState,
  (updater: Updater<ColumnFiltersState>) => void
];

interface IUseTableSearchOptions {
  history?: 'push' | 'replace';
}

function getColumnId<TData>(col: ColumnDef<TData, any>): string {
  if (col.id) return col.id;
  if ('accessorKey' in col && col.accessorKey) {
    return String(col.accessorKey);
  }
  throw new Error('Column must have either id or accessorKey');
}

export function useTableSearch<TData>(
  columns: ColumnDef<TData, any>[],
  options?: IUseTableSearchOptions
): TTableSearchResult {
  const navigate = useNavigate();
  const search: Record<string, unknown> = useSearch({ strict: false });

  const { history = 'replace' } = options ?? {};

  // Build lookup maps (stable while columns don't change)
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

  // Convert router search → columnFilters
  // Note: мы извлекаем только релевантные ключи (из searchKeyToColumnId),
  // чтобы не зависеть от всего объекта search целиком, если он нестабилен.
  const columnFilters: ColumnFiltersState = useMemo(() => {
    const out: ColumnFiltersState = [];

    for (const [searchKey, colId] of searchKeyToColumnId.entries()) {
      if (Object.prototype.hasOwnProperty.call(search, searchKey)) {
        const val = (search as Record<string, unknown>)[searchKey];
        // only include if value is not undefined (you can change rule if нужно)
        if (val !== undefined) {
          out.push({ id: colId, value: val });
        }
      }
    }

    return out;
  }, [search, searchKeyToColumnId]);

  // Convert columnFilters → router search (без debounce)
  const setColumnFilters = useCallback(
    (updater: Updater<ColumnFiltersState>) => {
      // Resolve newFilters from updater; не используем внешнюю columnFilters
      const newFilters =
        typeof updater === 'function' ? updater(columnFilters) : updater;

      // Build new search object starting from existing search,
      // but we will remove cleared search keys instead of setting them to undefined.
      const nextSearch = { ...search };

      // Track which searchable keys are set by newFilters
      const activeSearchKeys = new Set<string>();
      for (const filter of newFilters) {
        const searchKey = columnIdToSearchKey.get(filter.id);
        if (searchKey) {
          // set or overwrite
          (nextSearch as Record<string, unknown>)[searchKey] = filter.value;
          activeSearchKeys.add(searchKey);
        }
      }

      // Remove searchable keys that are not active anymore
      for (const searchKey of columnIdToSearchKey.values()) {
        if (!activeSearchKeys.has(searchKey)) {
          // delete key to avoid leaving undefined in URL
          if (Object.prototype.hasOwnProperty.call(nextSearch, searchKey)) {
            delete (nextSearch as Record<string, unknown>)[searchKey];
          }
        }
      }

      // always reset to first page on search change
      (nextSearch as Record<string, unknown>)['page'] = 1;

      void navigate({
        to: '.',
        search: () => nextSearch,
        replace: history === 'replace',
      });
    },
    // NOT including columnFilters in deps to avoid unnecessary recreation;
    // include stable maps and navigate/history/search
    [columnIdToSearchKey, navigate, history, search]
  );

  return [columnFilters, setColumnFilters];
}