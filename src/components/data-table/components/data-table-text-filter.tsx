"use no memo";
import type { Column } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ChangeEvent, ComponentProps, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { DEFAULT_DEBOUNCE } from '@/components/data-table/types/consts';


interface DataTableTextFilterProps<TData, TValue> extends ComponentProps<typeof Input> {
  column: Column<TData, TValue>;
  type?: 'number' | 'text';
}

export function DataTableTextFilter<TData, TValue>(props: DataTableTextFilterProps<TData, TValue>) {
  const { column, className, type = 'text', ...restOfProps } = props;
  const [value, setValue] = useState((column.getFilterValue() as string) ?? '');
  const meta = column.columnDef.meta;
  const title = meta?.label ?? column.id;
  const filterValue = column.getFilterValue();

  const debouncedSetFilter = useDebouncedCallback((val: string) => {
    if (type === 'number') {
      const parsed = val.trim() === '' ? undefined : Number(val);
      column.setFilterValue(parsed);
      return;
    }

    column.setFilterValue(val);
  }, DEFAULT_DEBOUNCE);

  useEffect(() => {
    if (debouncedSetFilter.isPending())
      return;

    setValue((column.getFilterValue() as string) ?? '');
  }, [filterValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;


    if (type === 'number' && !/^\d*\.?\d*$/.test(val))
      return;

    setValue(val);
    debouncedSetFilter(val);
  };

  const reset = () => {
    setValue('');
    column.setFilterValue(undefined);
    debouncedSetFilter.cancel();
  }


  return (
    <div className="relative">
      <Input
        {...restOfProps}
        type={type === 'number'? 'number' : 'text'}
        itemType={type === 'number'? 'number' : 'text'}
        placeholder={meta?.search?.placeholder ?? title}
        value={value}
        onChange={handleChange}
        className={cn(
          'h-8 w-40 lg:w-56 pr-8',
          '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          className
        )}
      />

      {value && (
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
            {value && <XIcon className="size-3.5"/>}
            <span className="sr-only">Clear</span>
          </Button>
        </div>
      )}
    </div>
  );
}
