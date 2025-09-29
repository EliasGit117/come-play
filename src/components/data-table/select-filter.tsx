import { useCallback, useState } from 'react';
import type { Column } from '@tanstack/react-table';
import { PlusCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  ColumnFilterType,
  IFacetedOption,
  TFacetedOptionValue
} from '@/components/data-table/types/tanstack-table-meta';
import * as React from 'react';

interface IDataTableSelectFilter<TData, TValue> {
  column: Column<TData, TValue>;
}

export function DataTableSelectFilter<TData, TValue>({ column }: IDataTableSelectFilter<TData, TValue>) {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const filterValue = (column.getFilterValue() as TFacetedOptionValue ?? undefined);
  const meta = column.columnDef.meta;
  const title = meta?.label ?? column.id;
  const [open, setOpen] = useState(false);

  if (meta?.filter?.type !== ColumnFilterType.Select)
    throw new Error('DataTableFacetedFilter only supports Select type');

  const options = meta.filter.options;
  const selectedOption = options.find(o => o.value === filterValue);

  const onItemSelect = useCallback((option: IFacetedOption, isSelected: boolean) => {
    column.setFilterValue(isSelected ? undefined : option.value);
  }, [filterValue, column]);

  const onReset = useCallback(() => column.setFilterValue(undefined), [column]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed !px-2.5">
          {!!filterValue ? (
            <div
              role="button"
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <XCircle/>
            </div>
          ) : (
            <PlusCircle/>
          )}
          {title}
          {!!filterValue && (
            <>
              <Separator orientation="vertical" className="mx-0.5 data-[orientation=vertical]:h-4"/>
              <div className="items-center gap-1">
                {!!selectedOption && (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedOption.title}
                  </Badge>
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[12.5rem] p-0" align="start">
        <Command>
          <CommandInput placeholder={title}/>
          <CommandList className="max-h-full">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-[18.75rem] overflow-y-auto overflow-x-hidden">
              {options.map((option) => {
                const isSelected = option.value === filterValue;
                return (
                  <CommandItem key={`${option.value}`} onSelect={() => onItemSelect(option, isSelected)}>
                    <div className="flex size-4 items-center justify-center rounded-full border border-primary/50">
                      {isSelected && <div className="size-2 bg-primary rounded-full"/>}
                    </div>
                    {option.icon && <option.icon/>}
                    <span className="truncate">{option.title}</span>
                    {option.count && (
                      <Badge variant='outline' className="ml-auto font-mono text-xs px-1.5">
                        {option.count}
                      </Badge>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>

              <>
                <CommandSeparator/>
                <CommandGroup>
                  <CommandItem onSelect={onReset} className="justify-center text-center">
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}