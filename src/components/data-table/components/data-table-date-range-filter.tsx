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


interface IDataTableDateRangeFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

export function DataTableDateRangeFilter<TData, TValue>(props: IDataTableDateRangeFilterProps<TData, TValue>) {
  const { column } = props;
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const meta = column.columnDef.meta;
  const title = meta?.search?.placeholder ?? meta?.label ?? column.id;
  const filterValue = column.getFilterValue();
  const [value, setValue] = useState<DateRange | undefined>(() => {
    if (Array.isArray(filterValue)) {
      const [from, to] = filterValue;
      return from || to ? { from: from ?? undefined, to: to ?? undefined } : undefined;
    }

    return undefined;
  });

  const debouncedSetFilter = useDebouncedCallback((newValue: DateRange | undefined) => {
    const from = newValue?.from ?? null;
    const to = newValue?.to ?? null;

    column.setFilterValue([from, to != from ? to : null]);
  }, DEFAULT_DEBOUNCE);

  useEffect(() => {
    if (debouncedSetFilter.isPending())
      return;

    if (Array.isArray(filterValue)) {
      const [from, to] = filterValue;
      setValue(from || to ? { from: from ?? undefined, to: to ?? undefined } : undefined);
    } else {
      setValue(undefined);
    }
  }, [filterValue, debouncedSetFilter]);

  const handleChange = (newValue: DateRange | undefined) => {
    setValue(newValue);
    debouncedSetFilter(newValue);
  };

  const reset = () => {
    setValue(undefined);
    debouncedSetFilter(undefined);
    setIsOpen(false);
  };


  const formatDateRange = useCallback((range: DateRange) => {
    if (!range.from && !range.to) return '';
    if (range.from && range.to) {
      return `${formatDate(range.from)} - ${formatDate(range.to)}`;
    }
    return formatDate(range.from ?? range.to);
  }, []);

  const label = useMemo(() => {

    const hasSelectedDates = value?.from || value?.to;
    const dateText = hasSelectedDates ? formatDateRange(value) : 'Select date range';

    return (
      <span className="flex items-center gap-2">
        <span>{title}</span>
        {hasSelectedDates && (
          <>
            <Separator orientation="vertical" className="mx-0.5 data-[orientation=vertical]:h-4"/>
            <span>{dateText}</span>
          </>
        )}
      </span>
    );
  }, [value]);


  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed">
          {!!value ? (
            <div
              role="button"
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              onClick={reset}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <XCircle/>
            </div>
          ) : (
            <CalendarIcon/>
          )}
          {label}
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
  } catch (_err) {
    return '';
  }
}
