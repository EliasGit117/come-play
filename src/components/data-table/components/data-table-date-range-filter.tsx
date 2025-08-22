'use no memo';
import { DEFAULT_DEBOUNCE } from '@/components/data-table/types/consts';
import type { Column } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { CalendarIcon, XCircle } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';

export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {}
) {
  if (!date) return '';

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts
    }).format(new Date(date));
  } catch {
    return '';
  }
}

interface IDataTableDateRangeFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

function filterArrayToDateRange(filterValue: unknown): DateRange | undefined {
  if (!Array.isArray(filterValue)) return undefined;
  const [from, to] = filterValue;
  const has = from || to;
  return has ? { from: (from as Date) ?? undefined, to: (to as Date) ?? undefined } : undefined;
}

function dateRangeToFilterArray(range: DateRange | undefined): (Date | null)[] | undefined {
  if (!range) return undefined;
  const from = range.from ?? null;
  const to = range.to ?? null;
  return [from, to !== from ? to : null];
}

export function DataTableDateRangeFilter<TData, TValue>({
                                                          column
                                                        }: IDataTableDateRangeFilterProps<TData, TValue>) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const meta = column.columnDef.meta as any;
  const title = meta?.search?.placeholder ?? meta?.label ?? column.id;

  const initialValue = useMemo(() => filterArrayToDateRange(column.getFilterValue()), [
    column
  ]);
  const [value, setValue] = useState<DateRange | undefined>(() => initialValue);

  const debouncedSetFilter = useDebouncedCallback(
    (newRange: DateRange | undefined) => {
      const arr = dateRangeToFilterArray(newRange);
      column.setFilterValue(arr ?? undefined);
    },
    DEFAULT_DEBOUNCE
  );

  useEffect(() => {
    if (debouncedSetFilter.isPending()) return;
    const next = filterArrayToDateRange(column.getFilterValue());
    setValue(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column, debouncedSetFilter]);

  const handleChange = useCallback(
    (next: DateRange | undefined) => {
      setValue(next);
      debouncedSetFilter(next);
    },
    [debouncedSetFilter]
  );

  const reset = useCallback(() => {
    setValue(undefined);
    debouncedSetFilter(undefined);
    setIsOpen(false);
  }, [debouncedSetFilter]);

  const formatDateRange = useCallback((range: DateRange | undefined) => {
    if (!range) return '';
    const { from, to } = range;
    if (!from && !to) return '';
    if (from && to) return `${formatDate(from)} - ${formatDate(to)}`;
    return formatDate(from ?? to);
  }, []);

  const hasSelectedDates = Boolean(value?.from || value?.to);
  const dateText = hasSelectedDates ? formatDateRange(value) : 'Select date range';

  // keyboard handler for the non-button clear control
  const onClearKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        reset();
      }
    },
    [reset]
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed">
          {hasSelectedDates ? (
            <span
              role="button"
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              onClick={reset}
              onKeyDown={onClearKeyDown}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <XCircle />
            </span>
          ) : (
            <CalendarIcon />
          )}

          <span className="flex items-center gap-2">
            <span>{title}</span>
            {hasSelectedDates && (
              <>
                <Separator orientation="vertical" className="mx-0.5 data-[orientation=vertical]:h-4" />
                <span>{dateText}</span>
              </>
            )}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <div className="flex flex-col">
          <Calendar
            mode="range"
            selected={value}
            onSelect={handleChange}
            numberOfMonths={isMobile ? 1 : 2}
            captionLayout="dropdown"
          />

          <Button
            size="sm"
            variant="outline"
            className="m-2 mt-0 rounded-sm min-w-40 md:w-fit md:ml-auto"
            onClick={reset}
          >
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}