import { ComponentProps, FC } from 'react';
import { Table } from '@tanstack/react-table';
import { IAdminNewsBriefDto } from '@/features/news/dtos/admin-news-brief-dto';
import { cn } from '@/lib/utils';
import { DataTableProvider, DataTableToolbar, DataTable, DataTablePagination } from '@/components/data-table';

interface IProps extends ComponentProps<'div'> {
  table: Table<IAdminNewsBriefDto>;
}

export const NewsTable: FC<IProps> = ({ className, table, ...props }) => {
  // noinspection BadExpressionStatementJS
  "use no memo";

  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      <DataTableProvider table={table}>
        <DataTableToolbar/>
        <DataTable/>
        <DataTablePagination/>
      </DataTableProvider>
    </div>
  );
};


export default NewsTable;