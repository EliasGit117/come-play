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
import { Skeleton } from '@/components/ui/skeleton';

interface DataTableProps<TData> extends ComponentProps<'div'> {
  actionBar?: ReactNode;
  skeletonCellClassName?: string;
}

export function DataTable<TData>(props: DataTableProps<TData>) {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { table, isPending } = useDataTableContext();
  const {
    actionBar,
    children,
    className,
    skeletonCellClassName,
    ...restOfProps
  } = props;

  const headerGroups = table.getHeaderGroups();
  const rowModel = table.getRowModel();
  const visibleColumns = table.getVisibleLeafColumns();
  const pageSize = table.getState().pagination.pageSize ?? 10;

  const isEmpty = !rowModel.rows?.length;

  return (
    <div
      className={cn('flex w-full flex-col gap-2.5 overflow-auto', className)}
      {...restOfProps}
    >
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
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isPending && isEmpty ? (
              Array.from({ length: pageSize }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`}>
                  {visibleColumns.map((column, colIndex) => (
                    <TableCell
                      className={cn("h-10", skeletonCellClassName)}
                      key={`skeleton-cell-${rowIndex}-${colIndex}`}
                      style={{ ...getCommonPinningStyles({ column }) }}
                    >
                      <Skeleton className='h-full w-full' />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rowModel.rows?.length ? (
              rowModel.rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ ...getCommonPinningStyles({ column: cell.column }) }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length}
                  className="h-24 text-center"
                >
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