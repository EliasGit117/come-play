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
      title: 'Delete customer requests',
      description: 'Are you sure you want to delete the selected customer requests?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });

    if (!isConfirmed)
      return;

    toast.promise(deleteAsync({ ids: selectedItems.map((i) => i.id) }), {
      loading: 'Deleting customer requests...',
      success: 'Customer requests deleted successfully!',
      error: (err) => err instanceof Error ? err.message : 'Failed to delete customer requests.'
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
              <span className="sr-only sm:not-sr-only">Delete</span>
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
