"use no memo";

import { useNavigate, useSearch } from '@tanstack/react-router';
import { SortingState, Updater } from '@tanstack/react-table';
import { ASC_KEY, DESC_KEY, DIRECTION_KEY, ORDER_BY_KEY } from '../types/consts';
import { z } from 'zod';
import { useCallback } from 'react';

const sortingOptions = z.enum([ASC_KEY, DESC_KEY]);
const sortSchema = z.object({
  [ORDER_BY_KEY]: z.string(),
  [DIRECTION_KEY]: sortingOptions
});

interface IUseTableSortProps {
  history: 'push' | 'replace';
}


export function useTableSort(props: IUseTableSortProps): [SortingState, (updater: Updater<SortingState>) => void] {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();

  const { history = 'replace' } = props;

  const sortingState: SortingState = getSortingState(search);

  const setSort = (id?: string, order?: typeof ASC_KEY | typeof DESC_KEY) => {
    void navigate({
      to: '.',
      search: (prev: Record<string, unknown>) => ({
        ...prev,
        page: id && order ? 1 : undefined,
        [ORDER_BY_KEY]: id || undefined,
        [DIRECTION_KEY]: order || undefined
      }),
      replace: history === 'replace'
    });
  };


  const handleSortingChange = useCallback((updateSorting: Updater<SortingState>) => {
      const nextSorting = typeof updateSorting === 'function'
        ? updateSorting(sortingState)
        : updateSorting;

      if (nextSorting.length > 0) {
        const { id: columnId, desc: isDescending } = nextSorting[0];
        const sortOrder = isDescending ? DESC_KEY : ASC_KEY;

        setSort(columnId, sortOrder);
        return;
      }

      setSort(undefined, undefined);
    }, [sortingState, navigate]
  );


  return [sortingState, handleSortingChange];
}


function getSortingState(value: unknown): SortingState {
  const res = sortSchema.safeParse(value);
  return res.success ? [{ id: res.data[ORDER_BY_KEY], desc: res.data[DIRECTION_KEY] === DESC_KEY }] : [];
}
