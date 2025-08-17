"use no memo";

import { DataTable, DataTablePagination, DataTableProvider, DataTableToolbar } from '@/components/data-table';
import { NewsBriefDto } from '@/features/news/dtos/news-brief-dto';
import { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';


interface IProps extends Omit<ComponentProps<typeof DataTableProvider<NewsBriefDto>>, 'children'> {
  className?: string;
}

const NewsTable: FC<IProps> = ({ className, ...tableProviderProps }) => {

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <DataTableProvider {...tableProviderProps}>
        <DataTableToolbar/>
        <DataTable/>
        <DataTablePagination/>
      </DataTableProvider>
    </div>
  );
};

export default NewsTable;