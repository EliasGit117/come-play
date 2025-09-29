import { ChangeEvent, ComponentProps, useEffect, useRef } from 'react';
import { Column } from '@tanstack/react-table';
import { ColumnFilterType } from '@/components/data-table/types/tanstack-table-meta';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from 'use-debounce';

interface IDataTableTextFilterProps<TData, TValue>
  extends ComponentProps<typeof Input> {
  column: Column<TData, TValue>;
}

export function DataTableTextFilter<TData, TValue>(props: IDataTableTextFilterProps<TData, TValue>) {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { column, className, type = ColumnFilterType.Text, ...restOfProps } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const meta = column.columnDef.meta;
  const title = meta?.label ?? column.id;

  const filterValue = column.getFilterValue() as string | undefined;
  const debouncedSetFilter = useDebouncedCallback(() => {}, 300);

  useEffect(() => {
    if (debouncedSetFilter.isPending() || !inputRef.current?.value || inputRef.current.value === (filterValue ?? ''))
      return;

    inputRef.current.value = filterValue ?? '';
  }, [filterValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (inputRef.current)
      inputRef.current.value = value;

    debouncedSetFilter()
    column.setFilterValue(value || undefined);
  };

  const reset = () => {
    if (inputRef.current)
      inputRef.current.value = '';

    column.setFilterValue(undefined);
  };

  if (meta?.filter?.type !== ColumnFilterType.Text)
    throw new Error('Filter must be a type Text');

  return (
    <div className="relative">
      <Input
        {...restOfProps}
        ref={inputRef}
        id={`${title}-filter`}
        type={type}
        placeholder={meta?.filter?.placeholder ?? title}
        defaultValue={filterValue ?? ''}
        onChange={handleChange}
        className={cn(
          'h-8 w-40 lg:w-56',
          '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          inputRef.current?.value && 'pr-8',
          className
        )}
      />

      {filterValue && (
        <div className="absolute right-1 top-0 bottom-0 flex">
          <Button
            tabIndex={-1}
            type="button"
            variant="ghost"
            size="icon"
            className="size-6 my-auto text-muted-foreground"
            onClick={reset}
            disabled={restOfProps.disabled}
          >
            <XIcon className="size-3.5"/>
            <span className="sr-only">Clear</span>
          </Button>
        </div>
      )}
    </div>
  );
}

