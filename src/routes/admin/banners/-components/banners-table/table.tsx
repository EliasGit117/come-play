import { ComponentProps, FC, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  DataTableProvider,
  DataTableToolbar,
  DataTable, useDataTable
} from '@/components/data-table';
import {
  getBannersForAdminQueryOptions,
  TGetBannersForAdminSchema
} from '@/features/banners/server-functions/admin/get-banners-paginagted-for-admin';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { bannerColumns } from '@/routes/admin/banners/-components/banners-table/columns';
import AdaptiveButton from '@/components/ui/adaptive-button';
import { ListStartIcon, TrashIcon } from 'lucide-react';
import { CreateBannerDialogTrigger } from '@/routes/admin/banners/-components/create-banner-dialog/trigger';
import { CreateBannerDialog } from '@/routes/admin/banners/-components/create-banner-dialog/dialog';
import { CreateBannerDialogProvider } from '@/routes/admin/banners/-components/create-banner-dialog/provider';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { useDeleteBannersByIdsMutation } from '@/features/banners/server-functions/admin/delete-banner-by-ids';

interface IProps extends ComponentProps<'div'> {
  search?: TGetBannersForAdminSchema;
}

export const BannerTable: FC<IProps> = (props) => {
  // noinspection BadExpressionStatementJS
  'use no memo';
  const { className, search = {}, ...restOfProps } = props;
  const confirm = useConfirm();
  const { data, isPending } = useQuery({
    ...getBannersForAdminQueryOptions(search),
    placeholderData: keepPreviousData
  });

  const { isPending: isDeleting, mutateAsync: deleteAsync } = useDeleteBannersByIdsMutation();
  const isLoading = isPending || isDeleting;
  const columns = useMemo(() => bannerColumns({ disabled: isLoading }), [isLoading]);

  const { table, selectedItems } = useDataTable({
    data: data,
    page: 1,
    limit: 10,
    total: data?.length,
    totalPages: 1,
    columns: columns,
    pageOnSearchChange: 'none',
    initialState: {
      columnVisibility: {
        id: false,
        updatedAt: false,
        createdAt: false
      },
      columnPinning: {
        left: ['select'],
        right: ['actions']
      }
    }
  });

  const deleteBanners = useCallback(async () => {
    if (selectedItems.length === 0)
      return;

    const isConfirmed = await confirm({
      title: 'Delete banners',
      description: 'Are you sure you want to delete selected banners?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    })

    if (!isConfirmed)
      return;

    toast.promise(deleteAsync({
      data: { ids: selectedItems.map((i) => i.id) }
    }), {
      loading: 'Deleting banners...',
      success: 'Banners deleted successfully!',
      error: (err) => err instanceof Error ? err.message : 'Failed to delete banners.'
    });
  }, [deleteAsync, selectedItems]);


  return (
    <CreateBannerDialogProvider>
      <div className={cn('flex flex-col gap-2', className)} {...restOfProps}>
        <DataTableProvider table={table} isPending={isPending}>
          <DataTableToolbar>
            <div className="flex-1"/>
            {selectedItems.length > 0 && (
              <Button
                size="sm"
                variant="ghost-destructive"
                disabled={isLoading}
                onClick={deleteBanners}
              >
                <TrashIcon/>
                <span className="sr-only sm:not-sr-only">Delete</span>
              </Button>
            )}

            <AdaptiveButton
              variant="ghost"
              size="sm"
              disabled={isPending}
              icon={ListStartIcon}
              text="Reorder"
            />

            <CreateBannerDialogTrigger size="sm" variant="ghost" className="w-8 sm:w-fit"/>
          </DataTableToolbar>

          <DataTable/>

          <CreateBannerDialog/>
        </DataTableProvider>
      </div>
    </CreateBannerDialogProvider>
  );
};

export default BannerTable;