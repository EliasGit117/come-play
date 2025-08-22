'use client';
'use no memo';
import { useCallback, useEffect, useState } from 'react';
import type { Column } from '@tanstack/react-table';
import { Check, PlusCircle, XCircle } from 'lucide-react';
import * as React from 'react';

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
import { ISelectOption } from '@/components/data-table/types/filtration';
import { useDebouncedCallback } from 'use-debounce';
import { DEFAULT_DEBOUNCE } from '@/components/data-table/types/consts';

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: ISelectOption[];
  multiple?: boolean;
}

export function DataTableFacetedFilter<TData, TValue>(props: DataTableFacetedFilterProps<TData, TValue>) {
  const {
    column,
    title,
    options,
    multiple
  } = props;
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<(string | number | boolean)[]>(column?.getFilterValue() ?? []);

  const filterValue = column?.getFilterValue();

  const debouncedSetFilter = useDebouncedCallback(
    (val: (string | number | boolean)[] | undefined) => {
      column?.setFilterValue(val as unknown as TValue);
    },
    DEFAULT_DEBOUNCE
  );

  useEffect(() => {
    if (debouncedSetFilter.isPending())
      return;

    if (filterValue === undefined) {
      setSelectedValues([]);
      return;
    }

    if (Array.isArray(filterValue)) {
      setSelectedValues(filterValue as (string | number | boolean)[]);
      return;
    }

    setSelectedValues([filterValue as string | number | boolean]);
  }, [filterValue, debouncedSetFilter]);

  const onItemSelect = useCallback(
    (option: ISelectOption, isSelected: boolean) => {
      let newSelected: (string | number | boolean)[];

      if (multiple) {
        if (isSelected) {
          newSelected = selectedValues.filter((v) => v !== option.value);
        } else {
          newSelected = [...selectedValues, option.value];
        }
      } else {
        newSelected = isSelected ? [] : [option.value];
        setOpen(false);
      }

      // update local + debounce table
      setSelectedValues(newSelected);
      debouncedSetFilter(newSelected.length ? newSelected : undefined);
    },
    [multiple, selectedValues, debouncedSetFilter]
  );

  const onReset = useCallback((event?: React.MouseEvent) => {
    event?.stopPropagation();
    setSelectedValues([]);
    debouncedSetFilter(undefined);
  }, [debouncedSetFilter]);

  const selectedSet = new Set(selectedValues);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed">
          {selectedValues.length > 0 ? (
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
          {selectedValues.length > 0 && (
            <>
              <Separator
                orientation="vertical"
                className="mx-0.5 data-[orientation=vertical]:h-4"
              />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.length}
              </Badge>
              <div className="hidden items-center gap-1 lg:flex">
                {selectedValues.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.length} selected
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
            {selectedValues.length > 0 && (
              <>
                <CommandSeparator/>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onReset()}
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