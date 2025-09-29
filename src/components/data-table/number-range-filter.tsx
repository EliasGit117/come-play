import { ComponentProps, useCallback } from 'react';
import { NumberInput } from '@/components/ui/number-input';
import { Column } from '@tanstack/react-table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { PlusCircle, XCircle } from 'lucide-react';
import { ColumnFilterType } from '@/components/data-table/types/tanstack-table-meta';
import { numberRangeSchema, TNumberRange } from '@/components/data-table/types/schemas';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';

interface IDataTableNumberRangeFilterProps<TData, TValue>
  extends ComponentProps<typeof NumberInput> {
  column: Column<TData, TValue>;
}

export function DataTableNumberRangeFilter<TData, TValue>(props: IDataTableNumberRangeFilterProps<TData, TValue>) {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { column } = props;
  const meta = column.columnDef.meta;

  if (meta?.filter?.type !== ColumnFilterType.NumberRange) return null;

  const title = meta?.label ?? column.id;
  const filterValue = column.getFilterValue() as TNumberRange | undefined;
  const min = meta.filter.min;
  const max = meta.filter.max;

  const handleChange = useCallback((val: number | undefined, key: 'min' | 'max') => {
    const [currMin, currMax] = filterValue ?? [null, null];
    const next: TNumberRange = key === 'min' ? [val ?? null, currMax] : [currMin, val ?? null];

    if (min !== undefined && next[0] !== null && next[0] < min)
      return;

    if (max !== undefined && next[1] !== null && next[1] > max)
      return;

    const { success } = numberRangeSchema.safeParse(next);
    if (!success)
      return;

    column.setFilterValue(next);
  }, [column, filterValue]);

  const sliderChange = (value: number[]) => {
    const next: (number | null)[] = value;
    if (!min || !max)
      return;

    if (value[0] <= min)
      next[0] = null;

    if (value[1] >= max)
      next[1] = null;

    if (next[0] === null && next[1] === null) {
      column.setFilterValue(undefined);
      return;
    }

    column.setFilterValue(next);
  };

  const text = getFilterText(filterValue);

  const clear = () => column.setFilterValue(undefined);

  return (
    <Popover>
      <PopoverTrigger className="h-8" asChild>
        <Button variant="outline" size="sm" className="border-dashed">
          {!!filterValue ? (
            <div
              role="button"
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              onClick={(e) => {
                e.stopPropagation();
                clear();
              }}
            >
              <XCircle/>
            </div>
          ) : (
            <PlusCircle/>
          )}
          <span>{title}</span>
          {!!text ? (
            <>
              <Separator orientation="vertical" className="mx-0.5 data-[orientation=vertical]:h-4"/>
              <span className="text-xs">{text}</span>
            </>
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="space-y-2 w-full max-w-64 sm:max-w-72 p-4"
      >
        <p className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {title}
        </p>

        <div className="flex gap-2">
          <NumberInput
            inputSize="sm"
            value={filterValue?.[0] ?? undefined}
            min={min}
            max={filterValue?.[1] ?? max}
            onValueChange={(v) => handleChange(v, 'min')}
            placeholder={'Min'}
          />
          <NumberInput
            inputSize="sm"
            min={filterValue?.[0] ?? min}
            max={max}
            value={filterValue?.[1] ?? undefined}
            onValueChange={(v) => handleChange(v, 'max')}
            placeholder={'Max'}
          />
        </div>

        {(!!min && !!max) && (
          <div className="py-2">
            <Slider
              step={1}
              value={!!filterValue ? [filterValue[0] ?? min, filterValue[1] ?? max] : [min, max]}
              onValueChange={sliderChange}
              min={min}
              max={max}
            />
          </div>
        )}

        {!!filterValue && (
          <Button size="sm" variant="outline" className="w-full" onClick={clear}>
            Clear filters
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}

function getFilterText(filterValue?: [number | null, number | null]) {
  if (!filterValue) return null;

  const [from, to] = filterValue;

  if (from != null && to != null) {
    return `${from} - ${to}`;
  }

  if (from != null) {
    return `${from} ≤`;
  }

  if (to != null) {
    return `≤ ${to}`;
  }

  return null;
}