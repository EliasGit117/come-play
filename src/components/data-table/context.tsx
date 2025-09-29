import { createContext, ReactNode, useContext } from 'react';
import { Table } from "@tanstack/react-table";

export interface IDataTableContext<TData> {
  table: Table<TData>;
}

export interface IDataTableProviderProps<TData> {
  table: Table<TData>;
  children: ReactNode;
}

const DataTableContext = createContext<IDataTableContext<any> | undefined>(undefined);

export function DataTableProvider<TData>({ table, children, }: IDataTableProviderProps<TData>) {

  return (
    <DataTableContext.Provider value={{ table }}>
      {children}
    </DataTableContext.Provider>
  );
}

export function useDataTableContext<TData>() {
  const context = useContext(DataTableContext);
  if (!context)
    throw new Error("useDataTable must be used within a DataTableProvider");

  return context;
}
