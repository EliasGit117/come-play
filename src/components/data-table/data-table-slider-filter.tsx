'use client';
'use no memo';
import { PlusCircle, XCircle } from 'lucide-react';
import type { Column } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import React, { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { SearchInputType } from '@/components/data-table/types/filtration';
import { DEFAULT_DEBOUNCE } from '@/components/data-table/types/consts';

interface IRange {
  min: number;
  max: number;
}

type RangeValue = [number, number];

function getIsValidRange(value: unknown): value is RangeValue {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === 'number' &&
    typeof value[1] === 'number'
  );
}

interface DataTableSliderFilterProps<TData> {
  column: Column<TData, unknown>;
}

export function DataTableSliderFilter<TData>(props: DataTableSliderFilterProps<TData>) {
  const { column } = props;
  const meta = column.columnDef.meta;
  const id = useId();

  if (meta?.search?.type !== SearchInputType.NumberRange)
    return null;

  const title = meta.label ?? column.id;

  const columnFilterValue =
    getIsValidRange(column.getFilterValue()) ? (column.getFilterValue() as RangeValue) : undefined;

  const defaultRange = meta.search.range;
  const unit = meta.search?.unit;

  const { min, max, step } = useMemo<IRange & { step: number }>(() => {
    let minValue = 0;
    let maxValue = 100;

    if (defaultRange && getIsValidRange(defaultRange)) {
      [minValue, maxValue] = defaultRange;
    } else {
      const values = column.getFacetedMinMaxValues();
      if (values && Array.isArray(values) && values.length === 2) {
        const [facetMinValue, facetMaxValue] = values;
        if (typeof facetMinValue === 'number' && typeof facetMaxValue === 'number') {
          minValue = facetMinValue;
          maxValue = facetMaxValue;
        }
      }
    }

    const rangeSize = maxValue - minValue;
    const step = rangeSize <= 20 ? 1 : rangeSize <= 100 ? Math.ceil(rangeSize / 20) : Math.ceil(rangeSize / 50);

    return { min: minValue, max: maxValue, step };
  }, [column, defaultRange]);

  const [localRange, setLocalRange] = useState<RangeValue>(() => columnFilterValue ?? [min, max]);

  useEffect(() => {
    if (debouncedSetFilter.isPending())
      return;

    setLocalRange(columnFilterValue ?? [min, max]);
  }, [columnFilterValue, min, max]);

  const debouncedSetFilter = useDebouncedCallback((value: RangeValue) => {
    column.setFilterValue(value);
  }, DEFAULT_DEBOUNCE);

  const onFromInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = Number(event.target.value);
      if (!Number.isNaN(numValue) && numValue >= min && numValue <= localRange[1]) {
        const newRange: RangeValue = [numValue, localRange[1]];
        setLocalRange(newRange);
        debouncedSetFilter(newRange);
      }
    },
    [debouncedSetFilter, min, localRange]
  );

  const onToInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = Number(event.target.value);
      if (!Number.isNaN(numValue) && numValue <= max && numValue >= localRange[0]) {
        const newRange: RangeValue = [localRange[0], numValue];
        setLocalRange(newRange);
        debouncedSetFilter(newRange);
      }
    },
    [debouncedSetFilter, max, localRange]
  );

  const onSliderValueChange = useCallback(
    (value: RangeValue) => {
      if (Array.isArray(value) && value.length === 2) {
        setLocalRange(value);
        debouncedSetFilter(value);
      }
    },
    [debouncedSetFilter]
  );

  const onReset = useCallback(
    (event: React.MouseEvent) => {
      if (event.target instanceof HTMLDivElement) {
        event.stopPropagation();
      }
      debouncedSetFilter.cancel();
      setLocalRange([min, max]);
      column.setFilterValue(undefined);
    },
    [column, debouncedSetFilter, min, max]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed">
          {columnFilterValue ? (
            <div
              role="button"
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              onClick={onReset}
            >
              <XCircle/>
            </div>
          ) : (
            <PlusCircle/>
          )}
          <span>{title}</span>
          {columnFilterValue ? (
            <>
              <Separator
                orientation="vertical"
                className="mx-0.5 data-[orientation=vertical]:h-4"
              />
              {columnFilterValue[0]} -{' '}
              {columnFilterValue[1]}
              {unit ? ` ${unit}` : ''}
            </>
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="flex w-auto flex-col gap-4">
        <div className="flex flex-col gap-3">
          <p className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {title}
          </p>
          <div className="flex items-center gap-4">
            <Label htmlFor={`${id}-from`} className="sr-only">
              From
            </Label>
            <div className="relative">
              <Input
                id={`${id}-from`}
                type="number"
                aria-valuemin={min}
                aria-valuemax={max}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={min.toString()}
                min={min}
                max={max}
                value={localRange[0]?.toString()}
                onChange={onFromInputChange}
                className={cn('h-8 w-24', unit && 'pr-8')}
              />
              {unit && (
                <span
                  className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-muted-foreground text-sm"
                >
                  {unit}
                </span>
              )}
            </div>
            <Label htmlFor={`${id}-to`} className="sr-only">
              To
            </Label>
            <div className="relative">
              <Input
                id={`${id}-to`}
                type="number"
                aria-valuemin={min}
                aria-valuemax={max}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={max.toString()}
                min={min}
                max={max}
                value={localRange[1]?.toString()}
                onChange={onToInputChange}
                className={cn('h-8 w-24', unit && 'pr-8')}
              />
              {unit && (
                <span
                  className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-muted-foreground text-sm"
                >
                  {unit}
                </span>
              )}
            </div>
          </div>
          <Label htmlFor={`${id}-slider`} className="sr-only">
            {title} slider
          </Label>
          <Slider
            id={`${id}-slider`}
            min={min}
            max={max}
            step={step}
            value={localRange}
            onValueChange={onSliderValueChange}
          />
        </div>
        <Button
          aria-label={`Clear ${title} filter`}
          variant="outline"
          size="sm"
          onClick={onReset}
        >
          Clear
        </Button>
      </PopoverContent>
    </Popover>
  );
}
