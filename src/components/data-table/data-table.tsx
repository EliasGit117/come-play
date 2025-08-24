"use no memo";
import React from "react";
import { Table as TanStackTable, Row, HeaderGroup } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface IDataTableProps<TData> {
  table: TanStackTable<TData>;
}

/**
 * Memoized header-group row: receives just the headerGroup object.
 * It only re-renders when headerGroup.id or headerGroup.headers changes.
 */
const HeaderGroupRow = React.memo(function HeaderGroupRow({
                                                            headerGroup,
                                                          }: {
  headerGroup: HeaderGroup<any>;
}) {
  return (
    <TableRow key={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <TableHead key={header.id}>
          {!header.isPlaceholder &&
            flexRender(header.column.columnDef.header, header.getContext())}
        </TableHead>
      ))}
    </TableRow>
  );
});

/**
 * Memoized data row: receives the row object and renders its visible cells.
 * It will re-render only when row.id or row.getVisibleCells() content changes.
 */
const DataRow = React.memo(function DataRow({
                                              row,
                                            }: {
  row: Row<any>;
}) {
  return (
    <TableRow key={row.id}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}, areRowsEqual);

/**
 * Custom comparison for DataRow to reduce re-renders.
 * TanStack Row objects are mutable-ish but provide stable ids.
 * We compare row.id and the cell ids / values to detect meaningful changes.
 */
function areRowsEqual(prev: { row: Row<any> }, next: { row: Row<any> }) {
  const prevRow = prev.row;
  const nextRow = next.row;

  if (prevRow.id !== nextRow.id) return false;

  const prevCells = prevRow.getVisibleCells();
  const nextCells = nextRow.getVisibleCells();

  if (prevCells.length !== nextCells.length) return false;

  for (let i = 0; i < prevCells.length; i++) {
    const pc = prevCells[i];
    const nc = nextCells[i];
    if (pc.id !== nc.id) return false;

    // Compare cell render output identity where possible:
    // Prefer comparing the cell value (if used by your cell renderer).
    // Fallback to compare getContext().row.original identity.
    const pv = pc.getContext().getValue ? pc.getContext().getValue() : pc.getContext().row?.original;
    const nv = nc.getContext().getValue ? nc.getContext().getValue() : nc.getContext().row?.original;
    if (pv !== nv) return false;
  }

  return true;
}

export function DataTable<TData>({ table }: IDataTableProps<TData>) {
  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  // Determine column count for the "No results" cellSpan
  const colCount = table.getAllColumns().length;

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {headerGroups.map((hg) => (
              <HeaderGroupRow key={hg.id} headerGroup={hg} />
            ))}
          </TableHeader>

          <TableBody>
            {rows?.length ? (
              rows.map((row) => <DataRow key={row.id} row={row} />)
            ) : (
              <TableRow>
                <TableCell colSpan={colCount} className="text-center">
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