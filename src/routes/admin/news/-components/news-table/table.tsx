'use no memo';
import { Table } from '@tanstack/react-table';
import { INewsBriefDto } from '@/features/news/dtos/news-brief-dto';
import { ConfirmDialogProvider } from '@/components/ui/confirm-dialog';
import { DataTable, DataTablePagination, DataTableToolbar } from '@/components/data-table';
import { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';


interface IProps extends Omit<ComponentProps<'div'>, 'children'> {
  className?: string;
  table: Table<INewsBriefDto>;
}

const NewsTable: FC<IProps> = ({ table, className, ...props }) => {

  return (
    <ConfirmDialogProvider>
      <div className={cn('flex flex-col gap-4', className)} {...props}>
          <DataTableToolbar table={table}/>
          <DataTable table={table}/>
          <DataTablePagination table={table}/>
      </div>
    </ConfirmDialogProvider>
  );
};

export default NewsTable;