import { useDataTableContext } from '@/components/data-table/context';
import { type ComponentProps, useMemo } from 'react';
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
import { IconTableOptions } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { m } from '@/paraglide/messages';


interface IDataTableColumnsOptionsProps<_> extends ComponentProps<typeof PopoverTrigger> {}

export function DataTableColumnsOptions<TData>({ ...props }: IDataTableColumnsOptionsProps<TData>) {
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
        <Button
          aria-label={m['dataTable.toggleColumns']()}
          role="combobox"
          variant="outline"
          className='w-7 sm:w-fit'
          size="sm"
        >
          <IconTableOptions/>
          <span className='sr-only sm:not-sr-only'>
            {m['dataTable.columns']()}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="min-w-48 w-fit p-0 gap-1">
        <Command className='space-y-1'>
          <CommandInput
            placeholder={m['dataTable.searchColumns']()}
            // wrapperClassName='p-0'
            // groupClassName='rounded-sm!'
          />

          <CommandList className="max-h-full">
            <CommandEmpty>
              {m['dataTable.noColumnsFound']()}
            </CommandEmpty>
            <CommandGroup className='p-0' heading={m['dataTable.columns']()}>
              {columns.map((column) => {
                const Icon = column.columnDef.meta?.icon;

                return (
                  <CommandItem
                    key={column.id}
                    data-checked={column.getIsVisible()}
                    onSelect={() => column.toggleVisibility(!column.getIsVisible())}
                  >
                    {Icon && <Icon className='size-4 text-muted-foreground'/>}
                    <span className="truncate">
                      {column.columnDef.meta?.label ?? column.id}
                    </span>
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
