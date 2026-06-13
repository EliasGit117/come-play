import { IconTrash } from '@tabler/icons-react';
import { ComponentProps, FC, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  DataTableProvider,
  DataTableToolbar,
  DataTable,
  DataTablePagination,
  useDataTable
} from '@/components/data-table';
import { TGetNewsPaginatedParamsForAdmin } from '@/features/news/schemas/search-news';
import { orpc } from '@/lib/orpc';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { newsColumns } from '@/routes/admin/news/-components/news-table/columns';
import {
  CreateNewsDialogProvider
} from '@/routes/admin/news/-components/create-news-dialog/provider';
import { CreateNewsDialog } from '@/routes/admin/news/-components/create-news-dialog/dialog';
import { CreateNewsDialogTrigger } from '@/routes/admin/news/-components/create-news-dialog/trigger';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

import { useConfirm } from '@/components/ui/confirm-dialog';
import * as React from 'react';
import { m } from '@/paraglide/messages';


interface IProps extends ComponentProps<'div'> {
  search?: TGetNewsPaginatedParamsForAdmin;
}

export const NewsTable: FC<IProps> = (props) => {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { className, search = {}, ...divProps } = props;
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    ...orpc.admin.news.search.queryOptions({ input: search }),
    placeholderData: keepPreviousData
  });

  const { isPending: isDeleting, mutateAsync: deleteAsync } = useMutation({
    ...orpc.admin.news.deleteMany.mutationOptions(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orpc.admin.news.key() });
    }
  });
  const isLoading = isPending || isDeleting;
  const columns = useMemo(() => newsColumns({ disabled: isLoading }), [isLoading]);

  const { table, selectedItems } = useDataTable({
    data: data?.items,
    page: data?.page,
    limit: search.limit,
    totalCount: data?.totalCount,
    pageCount: data?.pageCount,
    columns: columns,
    initialState: { columnPinning: { left: ['select'], right: ['actions'] } }
  });

  const deleteNews = useCallback(async () => {
    if (selectedItems.length === 0)
      return;

    const isConfirmed = await confirm({
      title: m['pages.admin.news.delete.confirmTitle'](),
      description: m['pages.admin.news.delete.confirmDescriptionBulk'](),
      confirmText: m['pages.admin.shared.actions.delete'](),
      cancelText: m['common.cancel']()
    });

    if (!isConfirmed)
      return;

    toast.promise(deleteAsync({ ids: selectedItems.map((i) => i.id) }), {
      loading: m['pages.admin.news.delete.loadingToast'](),
      success: m['pages.admin.news.delete.successToast'](),
      error: (err) => err instanceof Error ? err.message : m['pages.admin.news.delete.errorToast']()
    });
  }, [deleteAsync, selectedItems]);


  return (
    <div className={cn('flex flex-col gap-2', className)} {...divProps}>
      <CreateNewsDialogProvider>
        <DataTableProvider table={table} loading={isPending}>
          <DataTableToolbar>
            <div className="flex-1"/>
            {selectedItems.length > 0 && (
              <Button size="sm" variant="ghost-destructive" onClick={deleteNews} disabled={isLoading}>
                <IconTrash/>
                <span className="sr-only sm:not-sr-only">{m['pages.admin.shared.actions.delete']()}</span>
              </Button>
            )}

            <CreateNewsDialogTrigger size="sm" variant="ghost" shortText/>
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