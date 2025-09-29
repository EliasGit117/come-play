import { ComponentProps, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Column } from '@tanstack/react-table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar1Icon, XCircleIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { ColumnFilterType } from '@/components/data-table/types/tanstack-table-meta';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';


interface IDataTableDateFilterProps<TData, TValue>
  extends ComponentProps<typeof Input> {
  column: Column<TData, TValue>;
}

export function DataTableDateFilter<TData, TValue>(props: IDataTableDateFilterProps<TData, TValue>) {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const [open, setOpen] = useState(false);

  const { column, className } = props;
  const meta = column.columnDef.meta;
  const title = meta?.label ?? column.id;

  const filterValue = column.getFilterValue() as Date | undefined;


  if (meta?.filter?.type !== ColumnFilterType.Date)
    throw new Error('Filter must be a type Date');

  const disabledBefore = meta.filter?.disabledBefore;
  const disabledAfter = meta.filter?.disabledAfter;

  let disabled = [];

  if (!!disabledBefore)
    disabled.push({ before: disabledBefore });

  if (!!disabledAfter)
    disabled.push({ after: disabledAfter });

  const onReset = () => column.setFilterValue(undefined);

  const onSelect = (value: Date | undefined) => {
    setOpen(false);
    column.setFilterValue(value);
  };

  const dateText = useMemo(() => {
    if (!!filterValue)
      return format(filterValue, 'dd.MM.yyyy');

    return undefined;
  }, [filterValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={className} asChild>
        <Button variant="outline" size="sm" className="border-dashed !px-2.5">
          {!!filterValue ? (
            <span
              role="button"
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring p-0"
            >
              <XCircleIcon/>
            </span>
          ) : (
            <Calendar1Icon/>
          )}

          <span className="flex items-center gap-2">
            <span>{title}</span>
            {!!dateText && (
              <>
                <Separator orientation="vertical" className="mx-0.5 data-[orientation=vertical]:h-4"/>
                <span className='text-xs'>{dateText}</span>
              </>
            )}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={filterValue}
          captionLayout="dropdown"
          disabled={disabled}
          onSelect={onSelect}
        />

        {!!filterValue && (
          <div className="p-4 pt-0">
            <Button size="sm" variant="outline" className="w-full" onClick={onReset}>
              Clear filters
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}