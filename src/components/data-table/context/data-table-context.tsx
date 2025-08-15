"use no memo";

import React, { createContext, useContext, ReactNode } from 'react';
import { Table as TanStackTable } from '@tanstack/react-table';

interface TableContextType<TData> {
  table: TanStackTable<TData>;
}

const TableContext = createContext<TableContextType<any> | undefined>(undefined);
TableContext.displayName = 'TableContext';



interface IDataTableProviderProps<TData> {
  table: TanStackTable<TData>;
  children: ReactNode;
}

export const DataTableProvider = <TData,>({ table, children }: IDataTableProviderProps<TData>) => {
  return (
    <TableContext.Provider value={{ table }}>
      {children}
    </TableContext.Provider>
  );
};

export function useDataTableContext<TData>() {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useDataTableContext must be used within a DataTableProvider');
  }
  return context as TableContextType<TData>;
}
