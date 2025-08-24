'use no memo';
'use client';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { SortingState, Updater } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';
import { ASC_KEY, DESC_KEY, DIRECTION_KEY, ORDER_BY_KEY } from '../types/consts';
import { z } from 'zod';

// zod used only to tolerate malformed search; can be removed if unwanted.
const sortingOptions = z.enum([ASC_KEY, DESC_KEY]);
const sortSchema = z.object({
  [ORDER_BY_KEY]: z.string().optional(),
  [DIRECTION_KEY]: sortingOptions.optional(),
});

type Direction = typeof ASC_KEY | typeof DESC_KEY;

interface IUseTableSortProps {
  history?: 'push' | 'replace';
}

export function useTableSort(props: IUseTableSortProps = {}): [SortingState, (updater: Updater<SortingState>) => void] {
  const { history = 'replace' } = props;
  const navigate = useNavigate();
  const search = useSearch({ strict: false });

  // extract relevant keys explicitly so we don't depend on whole search object
  const orderBy = (search as Record<string, unknown>)[ORDER_BY_KEY] as string | undefined;
  const direction = (search as Record<string, unknown>)[DIRECTION_KEY] as Direction | undefined;

  const sortingState: SortingState = useMemo(() => {
    const parsed = sortSchema.safeParse({ [ORDER_BY_KEY]: orderBy, [DIRECTION_KEY]: direction });
    if (!parsed.success) return [];
    if (!parsed.data[ORDER_BY_KEY]) return [];
    return [{ id: parsed.data[ORDER_BY_KEY]!, desc: parsed.data[DIRECTION_KEY] === DESC_KEY }];
  }, [orderBy, direction]);

  const handleSortingChange = useCallback((updateSorting: Updater<SortingState>) => {
    // derive current from the extracted values so we don't read the entire search object
    const current: SortingState = sortingState;
    const nextSorting = typeof updateSorting === 'function' ? updateSorting(current) : updateSorting;

    if (nextSorting.length > 0) {
      const { id: columnId, desc: isDescending } = nextSorting[0];
      const sortOrder = (isDescending ? DESC_KEY : ASC_KEY) as Direction;

      void navigate({
        to: '.',
        search: (prev) =>
          ({
            ...(prev as Record<string, unknown>),
            page: columnId && sortOrder ? 1 : undefined,
            [ORDER_BY_KEY]: columnId || undefined,
            [DIRECTION_KEY]: sortOrder
          } as any),
        replace: history === 'replace'
      });

      return;
    }

    // clearing sorting
    void navigate({
      to: '.',
      search: (prev) =>
        ({
          ...(prev as Record<string, unknown>),
          page: undefined,
          [ORDER_BY_KEY]: undefined,
          [DIRECTION_KEY]: undefined
        } as any),
      replace: history === 'replace'
    });
  }, [navigate, history, sortingState]);

  return [sortingState, handleSortingChange];
}