import { ComponentProps, FC, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  DataTableProvider,
  DataTableToolbar,
  DataTable,
  useDataTable
} from '@/components/data-table';
import {
  getProductsForAdminQueryOptions,
  TGetProductsForAdminSchema
} from '@/features/products/server-functions/admin/get-products-for-admin';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { productColumns } from './columns';
import { TrashIcon } from 'lucide-react';
import {
  CreateProductDialogTrigger,
  CreateProductDialogProvider,
  CreateProductDialog
} from '@/routes/admin/products/-components/create-product-dialog';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { useDeleteProductsByIdsMutation } from '@/features/products/server-functions/admin/delete-products-by-ids';
import { toast } from 'sonner';

interface IProps extends ComponentProps<'div'> {
  search?: TGetProductsForAdminSchema;
}

export const ProductTable: FC<IProps> = (props) => {
  'use no memo';
  const { className, search = {}, ...restOfProps } = props;
  const confirm = useConfirm();
  const { data, isPending } = useQuery({
    ...getProductsForAdminQueryOptions(search),
    placeholderData: keepPreviousData
  });

  const { isPending: isDeleting, mutateAsync: deleteAsync } =
    useDeleteProductsByIdsMutation();
  const isLoading = isPending || isDeleting;
  const columns = useMemo(() => productColumns({ disabled: isLoading }), [isLoading]);

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
      deleteAsync({
        data: { ids: selectedItems.map((i) => i.id) }
      }),
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
        <DataTableProvider table={table} isPending={isPending}>
          <DataTableToolbar>
            <div className="flex-1" />
            {selectedItems.length > 0 && (
              <Button
                size="sm"
                variant="ghost-destructive"
                disabled={isLoading}
                onClick={deleteProducts}
              >
                <TrashIcon />
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