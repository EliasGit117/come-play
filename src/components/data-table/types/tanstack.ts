import type { RowData } from '@tanstack/react-table';
import { ISearchConfig } from '@/components/data-table/types/filtration';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string;
    search?: ISearchConfig;
  }
}