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
import { TGetCustomerRequestsPaginatedParamsForAdmin } from '@/features/customer-requests/schemas/search-customer-requests';
import { orpc } from '@/lib/orpc';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customerRequestsColumns } from '@/routes/admin/customer-requests/-components/customer-requests-table/columns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { m } from '@/paraglide/messages';


interface IProps extends ComponentProps<'div'> {
  search?: TGetCustomerRequestsPaginatedParamsForAdmin;
}

export const CustomerRequestsTable: FC<IProps> = (props) => {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { className, search = {}, ...divProps } = props;
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    ...orpc.admin.customerRequests.search.queryOptions({ input: search }),
    placeholderData: keepPreviousData
  });

  const { isPending: isDeleting, mutateAsync: deleteAsync } = useMutation({
    ...orpc.admin.customerRequests.deleteMany.mutationOptions(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orpc.admin.customerRequests.key() });
    }
  });
  const isLoading = isPending || isDeleting;
  const columns = useMemo(() => customerRequestsColumns({ disabled: isLoading }), [isLoading]);

  const { table, selectedItems } = useDataTable({
    data: data?.items,
    page: data?.page,
    limit: search.limit,
    totalCount: data?.totalCount,
    pageCount: data?.pageCount,
    columns: columns,
    initialState: { columnPinning: { left: ['select'], right: ['actions'] } }
  });

  const deleteRequests = useCallback(async () => {
    if (selectedItems.length === 0)
      return;

    const isConfirmed = await confirm({
      title: m['pages.admin.customerRequests.delete.confirmTitleBulk'](),
      description: m['pages.admin.customerRequests.delete.confirmDescriptionBulk'](),
      confirmText: m['pages.admin.shared.actions.delete'](),
      cancelText: m['common.cancel']()
    });

    if (!isConfirmed)
      return;

    toast.promise(deleteAsync({ ids: selectedItems.map((i) => i.id) }), {
      loading: m['pages.admin.customerRequests.delete.loadingToastBulk'](),
      success: m['pages.admin.customerRequests.delete.successToastBulk'](),
      error: (err) => err instanceof Error ? err.message : m['pages.admin.customerRequests.delete.errorToastBulk']()
    });
  }, [deleteAsync, selectedItems]);


  return (
    <div className={cn('flex flex-col gap-2', className)} {...divProps}>
      <DataTableProvider table={table} loading={isPending}>
        <DataTableToolbar>
          <div className="flex-1"/>
          {selectedItems.length > 0 && (
            <Button size="sm" variant="ghost-destructive" onClick={deleteRequests} disabled={isLoading}>
              <IconTrash/>
              <span className="sr-only sm:not-sr-only">{m['pages.admin.shared.actions.delete']()}</span>
            </Button>
          )}
        </DataTableToolbar>

        <DataTable/>
        <DataTablePagination/>
      </DataTableProvider>
    </div>
  );
};

export default CustomerRequestsTable;
