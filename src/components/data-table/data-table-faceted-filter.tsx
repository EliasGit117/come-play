'use client';
'use no memo';
import { useCallback, useMemo, useState } from 'react';
import type { Column } from '@tanstack/react-table';
import { Check, PlusCircle, XCircle } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { ISelectOption, TOptionValue } from '@/components/data-table/types/filtration';

interface DataTableFacetedFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
  title?: string;
  options: ISelectOption[];
  multiple?: boolean;
}

export function DataTableFacetedFilter<TData, TValue>(props: DataTableFacetedFilterProps<TData, TValue>) {
  const { column, options, multiple } = props;

  const filterValue = (column.getFilterValue() as TOptionValue[]) ?? [];
  const meta = column.columnDef.meta;
  const title = meta?.label ?? column.id;

  const [open, setOpen] = useState(false);
  const selectedSet = useMemo(() => new Set(filterValue), [filterValue]);

  const onItemSelect = useCallback((option: ISelectOption, isSelected: boolean) => {
    const newSelected = multiple ?
      (isSelected ? filterValue.filter((v) => v !== option.value) : [...filterValue, option.value]) :
      (isSelected ? [] : [option.value]);

    if (!multiple)
      setOpen(false);

    column.setFilterValue(newSelected.length > 0 ? newSelected : undefined);
  }, [multiple, filterValue, column]);

  const onReset = useCallback(() => column.setFilterValue(undefined), [column]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed">
          {filterValue.length > 0 ? (
            <div
              role="button"
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              onClick={onReset}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <XCircle/>
            </div>
          ) : (
            <PlusCircle/>
          )}
          {title}
          {filterValue.length > 0 && (
            <>
              <Separator
                orientation="vertical"
                className="mx-0.5 data-[orientation=vertical]:h-4"
              />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {filterValue.length}
              </Badge>
              <div className="hidden items-center gap-1 lg:flex">
                {filterValue.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {filterValue.length} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedSet.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={`${option.value}`}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
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
                const isSelected = selectedSet.has(option.value);
                return (
                  <CommandItem
                    key={`${option.value}`}
                    onSelect={() => onItemSelect(option, isSelected)}
                  >
                    <div
                      className={cn(
                        'flex size-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <Check/>
                    </div>
                    {option.icon && <option.icon/>}
                    <span className="truncate">{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {filterValue.length > 0 && (
              <>
                <CommandSeparator/>
                <CommandGroup>
                  <CommandItem
                    onSelect={onReset}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
