import { IconTrash } from '@tabler/icons-react';
import { ComponentProps, FC, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  DataTableProvider,
  DataTableToolbar,
  DataTable,
  useDataTable
} from '@/components/data-table';
import { TGetProductsForAdminSchema } from '@/features/products/schemas/search-products';
import { orpc } from '@/lib/orpc';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productColumns } from './columns';

import {
  CreateProductDialogTrigger,
  CreateProductDialogProvider,
  CreateProductDialog
} from '@/routes/admin/products/-components/create-product-dialog';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';

interface IProps extends ComponentProps<'div'> {
  search?: TGetProductsForAdminSchema;
}

export const ProductTable: FC<IProps> = (props) => {
  'use no memo';
  const { className, search = {}, ...restOfProps } = props;
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    ...orpc.admin.products.search.queryOptions({ input: search }),
    placeholderData: keepPreviousData
  });

  const { isPending: isDeleting, mutateAsync: deleteAsync } = useMutation({
    ...orpc.admin.products.delete.mutationOptions(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orpc.admin.products.key() });
    }
  });
  const isLoading = isPending || isDeleting;
  const columns = useMemo(() => productColumns({ disabled: isLoading }), [isLoading]);

  const { table, selectedItems } = useDataTable({
    data: data,
    page: 1,
    limit: 10,
    totalCount: data?.length,
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

  const deleteProducts = useCallback(async () => {
    if (selectedItems.length === 0) return;

    const isConfirmed = await confirm({
      title: 'Delete products',
      description: 'Are you sure you want to delete selected products?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });

    if (!isConfirmed) return;

    toast.promise(
      deleteAsync({ ids: selectedItems.map((i) => i.id) }),
      {
        loading: 'Deleting products...',
        success: 'Products deleted successfully!',
        error: (err) =>
          err instanceof Error ? err.message : 'Failed to delete products.'
      }
    );
  }, [deleteAsync, selectedItems, confirm]);

  return (
    <CreateProductDialogProvider>
      <div className={cn('flex flex-col gap-2', className)} {...restOfProps}>
        <DataTableProvider table={table} loading={isPending}>
          <DataTableToolbar>
            <div className="flex-1" />
            {selectedItems.length > 0 && (
              <Button
                size="sm"
                variant="ghost-destructive"
                disabled={isLoading}
                onClick={deleteProducts}
              >
                <IconTrash />
                <span className="sr-only lg:not-sr-only">Delete</span>
              </Button>
            )}

            <CreateProductDialogTrigger
              variant="ghost"
              size="sm"
              disabled={isPending}
              shortText
            />
          </DataTableToolbar>

          <DataTable />
          <CreateProductDialog />
        </DataTableProvider>
      </div>
    </CreateProductDialogProvider>
  );
};

export default ProductTable;