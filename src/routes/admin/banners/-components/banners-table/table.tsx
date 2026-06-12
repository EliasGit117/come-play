import { IconTrash } from '@tabler/icons-react';
import { ComponentProps, FC, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  DataTableProvider,
  DataTableToolbar,
  DataTable, useDataTable
} from '@/components/data-table';
import { TGetBannersForAdminSchema } from '@/features/banners/schemas/search-banners';
import { orpc } from '@/lib/orpc';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bannerColumns } from '@/routes/admin/banners/-components/banners-table/columns';

import {
  CreateBannerDialogTrigger,
  CreateBannerDialogProvider,
  CreateBannerDialog
} from '@/routes/admin/banners/-components/create-banner-dialog';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/ui/confirm-dialog';
import {
  ReorderBannersDialogProvider,
  ReorderBannersDialog,
  ReorderBannersDialogTrigger
} from '@/routes/admin/banners/-components/reorder-banners-dialog';
import { toast } from 'sonner';


interface IProps extends ComponentProps<'div'> {
  search?: TGetBannersForAdminSchema;
}

export const BannerTable: FC<IProps> = (props) => {
  // noinspection BadExpressionStatementJS
  'use no memo';
  const { className, search = {}, ...restOfProps } = props;
  const confirm = useConfirm();
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    ...orpc.admin.banners.search.queryOptions({ input: search }),
    placeholderData: keepPreviousData
  });

  const { isPending: isDeleting, mutateAsync: deleteAsync } = useMutation({
    ...orpc.admin.banners.deleteMany.mutationOptions(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orpc.admin.banners.key() });
    }
  });
  const isLoading = isPending || isDeleting;
  const columns = useMemo(() => bannerColumns({ disabled: isLoading }), [isLoading]);

  const { table, selectedItems } = useDataTable({
    data: data ?? [],
    page: 1,
    limit: 10,
    totalCount: data?.length ?? 0,
    pageCount: 1,
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
    });

    if (!isConfirmed)
      return;

    toast.promise(deleteAsync({ ids: selectedItems.map((i) => i.id) }), {
      loading: 'Deleting banners...',
      success: 'Banners deleted successfully!',
      error: (err) => err instanceof Error ? err.message : 'Failed to delete banners.'
    });
  }, [deleteAsync, selectedItems]);


  return (
    <CreateBannerDialogProvider>
      <ReorderBannersDialogProvider>
        <div className={cn('flex flex-col gap-2', className)} {...restOfProps}>
          <DataTableProvider table={table} loading={isPending}>
            <DataTableToolbar>
              <div className="flex-1"/>
              {selectedItems.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost-destructive"
                  disabled={isLoading}
                  onClick={deleteBanners}
                >
                  <IconTrash/>
                  <span className="sr-only lg:not-sr-only">Delete</span>
                </Button>
              )}

              <ReorderBannersDialogTrigger variant="ghost" size="sm" disabled={isPending} shortText/>
              <CreateBannerDialogTrigger variant="ghost" size="sm" disabled={isPending} shortText/>
            </DataTableToolbar>

            <DataTable/>

            <ReorderBannersDialog/>
            <CreateBannerDialog/>
          </DataTableProvider>
        </div>
      </ReorderBannersDialogProvider>
    </CreateBannerDialogProvider>
  );
};

export default BannerTable;