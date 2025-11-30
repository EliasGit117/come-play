import { ComponentProps, FC, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  DataTableProvider,
  DataTableToolbar,
  DataTable,
  DataTablePagination,
  useDataTable
} from '@/components/data-table';
import {
  getNewsPaginatedForAdminQueryOptions,
  TGetNewsPaginatedParamsForAdmin
} from '@/features/news/server-functions/admin/get-news-paginated-for-admin';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { newsColumns } from '@/routes/admin/news/-components/news-table/columns';
import {
  CreateNewsDialogProvider
} from '@/routes/admin/news/-components/create-news-dialog/provider';
import { CreateNewsDialog } from '@/routes/admin/news/-components/create-news-dialog/dialog';
import { CreateNewsDialogTrigger } from '@/routes/admin/news/-components/create-news-dialog/trigger';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import { useDeleteNewsByIdsMutation } from '@/features/news/server-functions/admin/delete-news-by-ids';
import { useConfirm } from '@/components/ui/confirm-dialog';
import * as React from 'react';


interface IProps extends ComponentProps<'div'> {
  search?: TGetNewsPaginatedParamsForAdmin;
}

export const NewsTable: FC<IProps> = (props) => {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { className, search = {}, ...divProps } = props;
  const confirm = useConfirm();
  const { data, isPending } = useQuery({
    ...getNewsPaginatedForAdminQueryOptions(search),
    placeholderData: keepPreviousData
  });

  const { isPending: isDeleting, mutateAsync: deleteAsync } = useDeleteNewsByIdsMutation();
  const isLoading = isPending || isDeleting;
  const columns = useMemo(() => newsColumns({ disabled: isLoading }), [isLoading]);

  const { table, selectedItems } = useDataTable({
    data: data?.items,
    page: data?.page,
    limit: search.limit,
    total: data?.totalCount,
    totalPages: data?.pageCount,
    columns: columns,
    initialState: { columnPinning: { left: ['select'], right: ['actions'] } }
  });

  const deleteNews = useCallback(async () => {
    if (selectedItems.length === 0)
      return;

    const isConfirmed = await confirm({
      title: 'Delete news',
      description: 'Are you sure you want to delete selected news?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });

    if (!isConfirmed)
      return;

    toast.promise(deleteAsync({
      data: { ids: selectedItems.map((i) => i.id) }
    }), {
      loading: 'Deleting news...',
      success: 'News deleted successfully!',
      error: (err) => err instanceof Error ? err.message : 'Failed to delete news.'
    });
  }, [deleteAsync, selectedItems]);


  return (
    <div className={cn('flex flex-col gap-2', className)} {...divProps}>
      <CreateNewsDialogProvider>
        <DataTableProvider table={table} isPending={isPending}>
          <DataTableToolbar>
            <div className="flex-1"/>
            {selectedItems.length > 0 && (
              <Button size="sm" variant="ghost-destructive" onClick={deleteNews} disabled={isLoading}>
                <TrashIcon/>
                <span className="sr-only sm:not-sr-only">Delete</span>
              </Button>
            )}

            <CreateNewsDialogTrigger size="sm" variant="ghost" className="w-8 lg:w-fit" shortText/>
          </DataTableToolbar>

          <DataTable/>
          <DataTablePagination/>
        </DataTableProvider>

        <CreateNewsDialog/>
      </CreateNewsDialogProvider>
    </div>
  );
};

export default NewsTable;