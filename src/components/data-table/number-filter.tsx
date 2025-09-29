import { ComponentProps, useCallback } from 'react';
import { Column } from '@tanstack/react-table';
import { ColumnFilterType } from '@/components/data-table/types/tanstack-table-meta';
import { NumberInput } from '@/components/ui/number-input';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';


interface IDataTableNumberFilterProps<TData, TValue>
  extends ComponentProps<typeof NumberInput> {
  column: Column<TData, TValue>;
}

export function DataTableNumberFilter<TData, TValue>(props: IDataTableNumberFilterProps<TData, TValue>) {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { column, className, ...restOfProps } = props;
  const meta = column.columnDef.meta;
  const filter = meta?.filter;
  const type = filter?.type;
  const title = meta?.label ?? column.id;
  const filterValue = column.getFilterValue() as number | undefined;

  if (type !== ColumnFilterType.Number)
    throw new Error('Filter must be a type NumberFilter');

  const { min, max, placeholder } = filter ?? {};

  const handleChange = useCallback((val: number | undefined) => {
    if (val !== undefined && min !== undefined && val < min) return;
    if (val !== undefined && max !== undefined && val > max) return;

    column.setFilterValue(val);
  }, [min, max, column]);

  const reset = () => column.setFilterValue(undefined);

  return (
    <div className="relative">
      <NumberInput
        value={filterValue}
        onValueChange={handleChange}
        id={`${title}-filter-input`}
        inputSize="sm"
        min={min}
        max={max}
        placeholder={placeholder}
        className="w-40 lg:w-56"
        inputClassName={cn(filterValue && 'pr-7')}
        {...restOfProps}
      />
      {filterValue && (
        <div className="absolute right-7 top-0 bottom-0 flex">
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
