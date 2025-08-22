'use no memo';
'use client';
import { useNavigate, useSearch } from "@tanstack/react-router";
import { SortingState, Updater } from "@tanstack/react-table";
import {
  ASC_KEY,
  DESC_KEY,
  DIRECTION_KEY,
  ORDER_BY_KEY,
} from "../types/consts";
import { z } from "zod";
import { useCallback } from "react";

const sortingOptions = z.enum([ASC_KEY, DESC_KEY]);
const sortSchema = z.object({
  [ORDER_BY_KEY]: z.string(),
  [DIRECTION_KEY]: sortingOptions,
});

type Direction = typeof ASC_KEY | typeof DESC_KEY;
type MaybeDirection = Direction | undefined;

interface IUseTableSortProps {
  history: "push" | "replace";
}

export function useTableSort(
  props: IUseTableSortProps
): [SortingState, (updater: Updater<SortingState>) => void] {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();

  const { history = "replace" } = props;

  const sortingState: SortingState = getSortingState(search);

  const handleSortingChange = useCallback(
    (updateSorting: Updater<SortingState>) => {
      const currentSorting = getSortingState(search);
      const nextSorting =
        typeof updateSorting === "function"
          ? updateSorting(currentSorting)
          : updateSorting;

      if (nextSorting.length > 0) {
        const { id: columnId, desc: isDescending } = nextSorting[0];

        // Приводим к узкому литеральному типу, ожидаемому роутером
        const sortOrder = (isDescending ? DESC_KEY : ASC_KEY) as MaybeDirection;

        // navigate.search ожидает специфичный тип, который может не совпадать
        // ровно с Record<string, unknown>. Приводим к any в месте возврата,
        // но формируем объект корректно: direction имеет значение 'asc'|'desc'|undefined.
        void navigate({
          to: ".",
          search: (prev: Record<string, unknown>) =>
            ({
              ...(prev as Record<string, unknown>),
              page: columnId && sortOrder ? 1 : undefined,
              [ORDER_BY_KEY]: columnId || undefined,
              [DIRECTION_KEY]: sortOrder,
            } as any),
          replace: history === "replace",
        });

        return;
      }

      // cleared sorting
      void navigate({
        to: ".",
        search: (prev: Record<string, unknown>) =>
          ({
            ...(prev as Record<string, unknown>),
            page: undefined,
            [ORDER_BY_KEY]: undefined,
            [DIRECTION_KEY]: undefined,
          } as any),
        replace: history === "replace",
      });
    },
    [navigate, history, search]
  );

  return [sortingState, handleSortingChange];
}

function getSortingState(value: unknown): SortingState {
  const res = sortSchema.safeParse(value);
  return res.success
    ? [
      {
        id: res.data[ORDER_BY_KEY],
        desc: res.data[DIRECTION_KEY] === DESC_KEY,
      },
    ]
    : [];
}