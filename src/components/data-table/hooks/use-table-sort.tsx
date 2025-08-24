'use no memo';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { SortingState, Updater } from '@tanstack/react-table';
import { ASC_KEY, DESC_KEY, DIRECTION_KEY, ORDER_BY_KEY } from '../types/consts';
import { useCallback } from 'react';
import { z } from 'zod';

const sortingOptions = z.enum([ASC_KEY, DESC_KEY]);
const sortSchema = z.object({
  [ORDER_BY_KEY]: z.string(),
  [DIRECTION_KEY]: sortingOptions
});

type Direction = typeof ASC_KEY | typeof DESC_KEY;

interface IUseTableSortProps {
  history?: 'push' | 'replace';
}

export function useTableSort(props?: IUseTableSortProps): [SortingState, (updater: Updater<SortingState>) => void] {
  const { history = 'replace' } = props ?? {};
  const search = useSearch({ strict: false });

  const orderBy = (search as Record<string, unknown>)[ORDER_BY_KEY] as string | undefined;
  const direction = (search as Record<string, unknown>)[DIRECTION_KEY] as (typeof ASC_KEY | typeof DESC_KEY | undefined);

  const sortingState: SortingState = getSortingState({ [ORDER_BY_KEY]: orderBy, [DIRECTION_KEY]: direction });
  const navigate = useNavigate();

  const handleSortingChange = useCallback((updateSorting: Updater<SortingState>) => {
      const currentSorting = getSortingState({ [ORDER_BY_KEY]: orderBy, [DIRECTION_KEY]: direction });
      const nextSorting = typeof updateSorting === 'function' ? updateSorting(currentSorting) : updateSorting;

      if (nextSorting.length > 0) {
        const { id: columnId, desc: isDescending } = nextSorting[0];
        const sortOrder = (isDescending ? DESC_KEY : ASC_KEY) as (Direction | undefined);

        void navigate({
          to: '.',
          search: (prev: Record<string, unknown>) =>
            ({
              ...prev,
              page: columnId && sortOrder ? 1 : undefined,
              [ORDER_BY_KEY]: columnId || undefined,
              [DIRECTION_KEY]: sortOrder
            } as any),
          replace: history === 'replace'
        });

        return;
      }

      void navigate({
        to: '.',
        replace: history === 'replace',
        search: (prev: Record<string, unknown>) => ({
          ...(prev as Record<string, unknown>),
          page: undefined,
          [ORDER_BY_KEY]: undefined,
          [DIRECTION_KEY]: undefined
        })
      });

    }, [navigate, history, orderBy, direction]);

  return [sortingState, handleSortingChange];
}

function getSortingState(value: unknown): SortingState {
  const res = sortSchema.safeParse(value);
  return res.success ? [{ id: res.data[ORDER_BY_KEY], desc: res.data[DIRECTION_KEY] === DESC_KEY }] : [];
}