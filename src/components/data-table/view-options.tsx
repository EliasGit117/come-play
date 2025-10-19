import { useDataTableContext } from '@/components/data-table/context';
import { ComponentProps, useMemo } from 'react';
import { Check, Settings2Icon } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import AdaptiveButton from '@/components/ui/adaptive-button';

interface IDataTableViewOptionsProps<TData> extends ComponentProps<typeof PopoverTrigger> {
}

export function DataTableViewOptions<TData>({ ...props }: IDataTableViewOptionsProps<TData>) {
  // noinspection BadExpressionStatementJS
  "use no memo";

  const { table } = useDataTableContext();
  const columns = useMemo(() =>
    table
      .getAllColumns()
      .filter((col) => typeof col.accessorFn !== 'undefined' && col.getCanHide()), [table]
  );

  return (
    <Popover>
      <PopoverTrigger {...props} asChild>
        <AdaptiveButton
          aria-label="Toggle columns"
          role="combobox"
          variant="outline"
          size="sm"
          icon={Settings2Icon}
          text='View'
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-44 p-0">
        <Command>
          <CommandInput placeholder="Search columns..."/>
          <CommandList>
            <CommandEmpty>No columns found.</CommandEmpty>
            <CommandGroup>
              {columns.map((column) => {
                const Icon = column.columnDef.meta?.icon;

                return (
                  <CommandItem key={column.id} onSelect={() => column.toggleVisibility(!column.getIsVisible())}>
                    {Icon && <Icon className='size-4' />}
                    <span className="truncate">
                      {column.columnDef.meta?.label ?? column.id}
                    </span>
                    <Check
                      className={cn(
                        'ml-auto size-4 shrink-0',
                        column.getIsVisible() ? 'opacity-100' : 'opacity-0'
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
