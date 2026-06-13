import { useDataTableContext } from '@/components/data-table/context';
import { type ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Separator } from '@/components/ui/separator';
import { IconArrowsUpDown, IconChevronDown, IconChevronUp, IconCircleX } from '@tabler/icons-react';
import { m } from '@/paraglide/messages';



interface IDataTableSortPopoverProps<_>
  extends ComponentProps<typeof PopoverTrigger> {
}

export function DataTableSortPopover<TData>({ ...props }: IDataTableSortPopoverProps<TData>) {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { table } = useDataTableContext();
  const sorting = table.getState().sorting;
  const sortableColumns = table.getAllColumns().filter(col => col.getCanSort());
  const currentSort = sorting[0] || null;

  return (
    <Popover>
      <PopoverTrigger {...props} asChild>
        <Button role="combobox" variant="outline" size="sm" className='w-7 sm:w-fit'>
          <IconArrowsUpDown/>
          <span className="sr-only sm:not-sr-only">
            {m['dataTable.sort.label']()}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="min-w-48 w-fit p-0 gap-1">
        <Command className="space-y-1">
          <CommandInput
            placeholder={m['dataTable.searchColumns']()}
            // wrapperClassName="p-0"
            // groupClassName="rounded-sm!"
          />
          <CommandList>
            <CommandEmpty>
              {m['dataTable.noColumnsFound']()}
            </CommandEmpty>
            <CommandGroup className="p-0" heading={m['dataTable.sort.by']()}>
              {sortableColumns.map((column) => {
                const Icon = column.columnDef.meta?.icon;

                return (
                  <CommandItem
                    key={column.id}
                    data-checked={currentSort?.id === column.id}
                    onSelect={() => table.setSorting([{ id: column.id, desc: !!currentSort?.desc }])}
                  >
                    {Icon && <Icon className="size-4 text-muted-foreground"/>}
                    <span className="truncate">
                      {column.columnDef.meta?.label ?? column.id}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>

        {!!currentSort && (
          <>
            <Separator/>

            <Command className="space-y-1">
              <CommandList>
                <CommandGroup className="p-0" heading={m['dataTable.sort.direction']()}>
                  <CommandItem
                    data-checked={!currentSort.desc}
                    onSelect={() => table.setSorting([{ id: currentSort.id, desc: false }])}
                  >
                    <IconChevronUp className="size-4 text-muted-foreground"/>
                    <span className="truncate uppercase">
                      {m['dataTable.sort.asc']()}
                    </span>
                  </CommandItem>

                  <CommandItem
                    data-checked={currentSort.desc}
                    onSelect={() => table.setSorting([{ id: currentSort.id, desc: true }])}
                  >
                    <IconChevronDown className="size-4 text-muted-foreground"/>
                    <span className="truncate uppercase">
                      {m['dataTable.sort.desc']()}
                    </span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>

            <Separator/>

            <Button size="sm" variant="ghost" className="m-1 mt-0" onClick={() => table.setSorting([])}>
              <IconCircleX/>
              <span>{m['dataTable.clear']()}</span>
            </Button>
          </>
        )}

      </PopoverContent>
    </Popover>
  );
}