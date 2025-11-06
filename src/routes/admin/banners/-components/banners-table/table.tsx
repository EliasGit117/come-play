import { ComponentProps, FC, ReactNode } from 'react';
import { Table } from '@tanstack/react-table';
import { IAdminBannerBriefDto } from '@/features/banners/dtos/admin-banner-brief-dto';
import { cn } from '@/lib/utils';
import {
  DataTableProvider,
  DataTableToolbar,
  DataTable,
} from '@/components/data-table';

interface IProps extends ComponentProps<'div'> {
  table: Table<IAdminBannerBriefDto>;
  topToolbarChildren?: ReactNode;
  isPending?: boolean;
}

export const BannerTable: FC<IProps> = (props) => {
  // noinspection BadExpressionStatementJS
  'use no memo';
  const { className, topToolbarChildren, table, isPending, ...restOfProps } = props;

  return (
    <div className={cn('flex flex-col gap-2', className)} {...restOfProps}>
      <DataTableProvider table={table} isPending={isPending}>
        <DataTableToolbar topToolbarChildren={topToolbarChildren} />
        <DataTable />
      </DataTableProvider>
    </div>
  );
};

export default BannerTable;