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

export const BannerTable: FC<IProps> = (props) => {
  // noinspection BadExpressionStatementJS
  'use no memo';
  const { className, topToolbarChildren, table, ...restOfProps } = props;

  return (
    <div className={cn('flex flex-col gap-2', className)} {...restOfProps}>
      <DataTableProvider table={table}>
        <DataTableToolbar topToolbarChildren={topToolbarChildren} />
        <DataTable />
        <DataTablePagination />
      </DataTableProvider>
    </div>
  );
};

export default BannerTable;