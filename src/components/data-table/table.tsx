import { useDataTableContext } from '@/components/data-table/context';
import { flexRender } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ComponentProps, ReactNode } from 'react';
import { getCommonPinningStyles } from '@/components/data-table/utils/pinning';

interface DataTableProps<TData> extends ComponentProps<'div'> {
  actionBar?: ReactNode;
}

export function DataTable<TData>(props: DataTableProps<TData>) {
  // noinspection BadExpressionStatementJS
  "use no memo";

  const { table } = useDataTableContext();
  const { actionBar, children, className, ...restOfProps } = props;

  const headerGroups = table.getHeaderGroups();
  const rowModel = table.getRowModel();
  const allColumns = table.getAllColumns();

  return (
    <div className={cn('flex w-full flex-col gap-2.5 overflow-auto', className)} {...restOfProps}>
      {children}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ ...getCommonPinningStyles({ column: header.column }) }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {rowModel.rows?.length ? (
              rowModel.rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} style={{ ...getCommonPinningStyles({ column: cell.column }) }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={allColumns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}