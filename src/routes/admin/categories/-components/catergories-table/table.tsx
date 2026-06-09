import { ComponentProps, FC, useCallback, useMemo } from 'react';
import {
  CreateCategoryDialogProvider,
  CreateCategoryDialogTrigger,
  CreateCategoryDialog
} from '@/routes/admin/categories/-components/create-category-dialog';
import { cn } from '@/lib/utils';
import {
  getCategoriesPaginatedForAdminQueryOptions,
  TGetCategoriesPaginatedParamsForAdmin
} from '@/features/categories/server-functions/admin/get-categories-paginated-for-admin';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  DataTable,
  DataTablePagination,
  DataTableProvider,
  DataTableToolbar,
  useDataTable
} from '@/components/data-table';
import { categoryColumns } from '@/routes/admin/categories/-components/catergories-table/columns';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import {
  EditCategoryDialog,
  EditCategoryDialogProvider
} from '@/routes/admin/categories/-components/edit-category-dialog';
import {
  useDeleteCategoriesByIdsMutation
} from '@/features/categories/server-functions/admin/delete-categories-by-ids';
import { toast } from 'sonner';


interface ICategoriesTableProps extends ComponentProps<'div'> {
  search?: TGetCategoriesPaginatedParamsForAdmin;
}

export const CategoriesTable: FC<ICategoriesTableProps> = (props) => {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { className, search = {}, ...restOfProps } = props;
  const confirm = useConfirm();

  const { data, isPending } = useQuery({
    ...getCategoriesPaginatedForAdminQueryOptions(search),
    placeholderData: keepPreviousData
  });

  const { isPending: isDeleting, mutateAsync: deleteAsync } = useDeleteCategoriesByIdsMutation();

  const isLoading = isPending || isDeleting;
  const columns = useMemo(() => categoryColumns({ disabled: isLoading }), [isLoading]);

  const { table, selectedItems } = useDataTable({
    data: data?.items,
    page: data?.page,
    limit: search.limit,
    totalCount: data?.totalCount,
    pageCount: data?.pageCount,
    columns,
    initialState: { columnPinning: { left: ['select'], right: ['actions'] } }
  });

  const deleteCategories = useCallback(async () => {
    if (selectedItems.length === 0)
      return;

    const isConfirmed = await confirm({
      title: 'Delete categories',
      description: 'Are you sure you want to delete the selected categories?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });

    if (!isConfirmed)
      return;

    toast.promise(
      deleteAsync({
        data: { ids: selectedItems.map((i) => i.id) }
      }),
      {
        loading: 'Deleting categories...',
        success: (result) => {
          if (result.failedCount > 0) {
            const failed = result.results.filter((r) => !r.success);
            const failedIds = failed
              .map((f) => f.categoryId)
              .join(', ');

            return `Deleted ${result.deletedCount} of ${result.totalRequested} categories. Failed: ${failedIds}`;
          }
          return 'Categories deleted successfully!';
        },
        error: (err) =>
          err instanceof Error
            ? err.message
            : 'Failed to delete categories.'
      }
    );
  }, [deleteAsync, confirm, selectedItems]);

  return (
    <div className={cn('flex flex-col gap-2', className)} {...restOfProps}>
      <CreateCategoryDialogProvider>
        <EditCategoryDialogProvider>
          <DataTableProvider table={table} loading={isPending}>
            <DataTableToolbar>
              <div className="flex-1"/>
              {selectedItems.length > 0 && (
                <Button size="sm" variant="ghost-destructive" onClick={deleteCategories} disabled={isLoading}>
                  <TrashIcon/>
                  <span className="sr-only sm:not-sr-only">Delete</span>
                </Button>
              )}
              <CreateCategoryDialogTrigger variant="ghost" size="sm" disabled={isPending} shortText/>
            </DataTableToolbar>

            <DataTable/>
            <DataTablePagination/>
          </DataTableProvider>

          <EditCategoryDialog/>
          <CreateCategoryDialog/>
        </EditCategoryDialogProvider>
      </CreateCategoryDialogProvider>
    </div>
  );
};