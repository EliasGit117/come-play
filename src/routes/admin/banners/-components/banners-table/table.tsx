import { ComponentProps, FC, ReactNode } from 'react';
import { Table } from '@tanstack/react-table';
import { IAdminBannerBriefDto } from '@/features/banners/dtos/admin-banner-brief-dto';
import { cn } from '@/lib/utils';
import {
  DataTableProvider,
  DataTableToolbar,
  DataTable,
  DataTablePagination
} from '@/components/data-table';

interface IProps extends ComponentProps<'div'> {
  table: Table<IAdminBannerBriefDto>;
  topToolbarChildren?: ReactNode;
}

export const BannerTable: FC<IProps> = ({
                                          className,
                                          topToolbarChildren,
                                          table,
                                          ...props
                                        }) => {
  // noinspection BadExpressionStatementJS
  'use no memo';

  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      <DataTableProvider table={table}>
        <DataTableToolbar topToolbarChildren={topToolbarChildren} />
        <DataTable />
        <DataTablePagination />
      </DataTableProvider>
    </div>
  );
};

export default BannerTable;