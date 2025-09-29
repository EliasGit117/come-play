import { useDataTableContext } from '@/components/data-table/context';
import { ComponentProps, useMemo } from 'react';
import { Check, ChevronsUpDown, PinIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface IDataTablePinOptionsProps<TData> extends ComponentProps<typeof PopoverTrigger> {}

export function DataTablePinOptions<TData>({ ...props }: IDataTablePinOptionsProps<TData>) {
  const { table } = useDataTableContext();

  const columns = useMemo(
    () =>
      table
        .getAllColumns()
        .filter((col) => typeof col.accessorFn !== 'undefined' && col.getCanPin()),
    [table]
  );

  return (
    <Popover>
      <PopoverTrigger {...props} asChild>
        <Button
          aria-label="Toggle pin columns"
          role="combobox"
          variant="outline"
          size="sm"
          className="h-8"
        >
          <PinIcon />
          <span>Pin</span>
          <ChevronsUpDown className="ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-44 p-0">
        <Command>
          <CommandInput placeholder="Search columns..." />
          <CommandList>
            <CommandEmpty>No columns found.</CommandEmpty>
            <CommandGroup>
              {columns.map((column) => {
                const Icon = column.columnDef.meta?.icon;

                return (
                  <CommandItem
                    key={column.id}
                    onSelect={() => column.pin?.(column.getIsPinned() ? false : 'right')}
                  >
                    {Icon && <Icon className="size-4" />}
                    <span className="truncate">{column.columnDef.meta?.label ?? column.id}</span>
                    <Check
                      className={cn(
                        'ml-auto size-4 shrink-0',
                        column.getIsPinned() ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
