"use no memo";

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

interface IDataTableSkeletonProps extends ComponentProps<'div'> {
  columnCount: number;
  rowCount?: number;
  cellWidths?: Array<string>;
  shrinkZero?: boolean;
}

export function DataTableSkeleton(props: IDataTableSkeletonProps) {
  const {
    columnCount,
    rowCount = 10,
    cellWidths = ['auto'],
    shrinkZero = false,
    className,
    ...restOfProps
  } = props;

  const cozyCellWidths = Array.from(
    { length: columnCount },
    (_, index) => cellWidths[index % cellWidths.length] ?? 'auto'
  );

  return (
    <div className={cn('flex w-full flex-col gap-2.5 overflow-auto', className)} {...restOfProps}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {Array.from({ length: 1 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableHead
                    key={j}
                    style={{
                      width: cozyCellWidths[j],
                      minWidth: shrinkZero ? cozyCellWidths[j] : 'auto'
                    }}
                  >
                    <Skeleton className="h-6 w-full"/>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {Array.from({ length: rowCount }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableCell
                    key={j}
                    style={{
                      width: cozyCellWidths[j],
                      minWidth: shrinkZero ? cozyCellWidths[j] : 'auto'
                    }}
                  >
                    <Skeleton className="h-6 w-full"/>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
