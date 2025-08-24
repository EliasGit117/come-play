'use client';
'use no memo';
import { useState } from 'react';
import type { ColumnSort, Table } from '@tanstack/react-table';
import { ArrowDownUp, TrashIcon, X } from 'lucide-react';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';
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

interface DataTableSortProps<TData>
  extends React.ComponentProps<typeof PopoverContent> {
  table: Table<TData>;
}

export function DataTableSort<TData>({ table, ...props }: DataTableSortProps<TData>) {
  const [open, setOpen] = useState(false);
  const sorting = table.getState().sorting;
  const sortableColumns = table.getAllColumns().filter(col => col.getCanSort());
  const currentSort = sorting[0] || null;

  const handleColumnChange = (columnId: string) => table.setSorting([{ id: columnId, desc: !!currentSort?.desc }]);

  const handleDirectionChange = (direction: string) => {
    if (!currentSort)
      return;

    table.setSorting([{ id: currentSort.id, desc: direction === 'desc' }]);
  };

  const clearSorting = () => {
    table.setSorting([]);
    setOpen(false);
  };


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <ArrowDownUp className="h-4 w-4"/>
          <span>Sort</span>
          {sorting.length > 0 && (
            <Badge variant="secondary"
                   className="h-[18.24px] rounded-[3.2px] px-[5.12px] font-mono font-normal text-[10.4px]">
              1
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent {...props} align="end" className="sm:min-w-96">
        <div className="space-y-2">
          <p className='font-semibold'>Sort by</p>

          <div className="flex gap-2">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-xs font-medium text-muted-foreground">
                Column
              </label>
              <Select value={currentSort?.id || ''} onValueChange={handleColumnChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select column..."/>
                </SelectTrigger>
                <SelectContent>
                  {sortableColumns.map(column => {
                    const columnId = column.id;
                    const meta = column.columnDef.meta;
                    const title = meta?.label ?? column.id;

                    return (
                      <SelectItem key={columnId} value={columnId}>
                        {title}
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
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select sorting..."/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">ASC</SelectItem>
                      <SelectItem value="desc">DESC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" size="icon" className="mt-auto" disabled={!currentSort}
                        onClick={clearSorting}>
                  <TrashIcon/>
                </Button>
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}