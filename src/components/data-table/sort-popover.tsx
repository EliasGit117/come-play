import { useDataTableContext } from '@/components/data-table/context';
import { useState } from 'react';
import { ArrowDownIcon, ArrowDownUp, ArrowUpIcon, BrushCleaningIcon } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface IDataTableSortPopoverProps<TData>
  extends React.ComponentProps<typeof PopoverTrigger> {
}

export function DataTableSortPopover<TData>({ ...props }: IDataTableSortPopoverProps<TData>) {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { table } = useDataTableContext();
  const [open, setOpen] = useState(false);
  const sorting = table.getState().sorting;
  const sortableColumns = table.getAllColumns().filter(col => col.getCanSort());
  const currentSort = sorting[0] || null;

  const handleColumnChange = (columnId: string) => table.setSorting([{ id: columnId, desc: !!currentSort?.desc }]);

  const handleDirectionChange = (dir: string) => {
    if (!currentSort)
      return;

    table.setSorting([{ id: currentSort.id, desc: dir === 'desc' }]);
  };

  const clearSorting = () => {
    table.setSorting([]);
    setOpen(false);
  };


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger {...props} asChild>
        <Button variant="outline" size="sm" className='h-8 w-8 sm:w-fit'>
          <ArrowDownUp className="h-4 w-4"/>
          <span className='sr-only sm:not-sr-only'>Sort</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="p-3">
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="font-semibld text-sm">Sort by</p>

            {!!currentSort && (
              <Button variant="ghost" size="icon-xs" className="-m-1" disabled={!currentSort} onClick={clearSorting}>
                <BrushCleaningIcon/>
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-xs font-medium text-muted-foreground">
                Column
              </label>
              <Select value={currentSort?.id || ''} onValueChange={handleColumnChange}>
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue placeholder="Select column..."/>
                </SelectTrigger>
                <SelectContent>
                  {sortableColumns.map(column => {
                    const columnId = column.id;
                    const meta = column.columnDef.meta;
                    const title = meta?.label ?? column.id;
                    const Icon = meta?.icon;

                    return (
                      <SelectItem key={columnId} value={columnId}>
                        {Icon && <Icon/>}
                        <span>{title}</span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {!!currentSort && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Direction
                  </label>
                  <Select
                    value={currentSort ? (currentSort.desc ? 'desc' : 'asc') : ''}
                    onValueChange={handleDirectionChange}
                    disabled={!currentSort}
                  >
                    <SelectTrigger size="sm" className="flex-1">
                      <SelectValue placeholder="Select sorting..."/>
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectItem value="asc">
                        <ArrowUpIcon/>
                        <span>ASC</span>
                      </SelectItem>
                      <SelectItem value="desc">
                        <ArrowDownIcon/>
                        <span>DESC</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}