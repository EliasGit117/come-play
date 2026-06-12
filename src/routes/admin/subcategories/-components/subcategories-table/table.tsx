import { IconTrash } from '@tabler/icons-react';
import { ComponentProps, FC, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc';
import {
  DataTable,
  DataTablePagination,
  DataTableProvider,
  DataTableToolbar,
  useDataTable
} from '@/components/data-table';
import { Button } from '@/components/ui/button';

import { toast } from 'sonner';
import { TGetSubcategoriesPaginatedForAdminSchema } from '@/features/subcategories/schemas/search-subcategories';
import { subcategoryColumns } from '@/routes/admin/subcategories/-components/subcategories-table/columns';
import {
  CreateSubcategoryDialog,
  CreateSubcategoryDialogProvider,
  CreateSubcategoryTrigger
} from '@/routes/admin/subcategories/-components/create-subcategory-dialog';
import {
  EditSubcategoryDialog,
  EditSubcategoryDialogProvider
} from '@/routes/admin/subcategories/-components/edit-subcategory-dialog';


interface ISubcategoriesTableProps extends ComponentProps<'div'> {
  search?: TGetSubcategoriesPaginatedForAdminSchema;
}

export const SubcategoriesTable: FC<ISubcategoriesTableProps> = (props) => {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { className, search = {}, ...restOfProps } = props;
  const confirm = useConfirm();
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    ...orpc.admin.subcategories.search.queryOptions({ input: search }),
    placeholderData: keepPreviousData
  });

  const { isPending: isDeleting, mutateAsync: deleteAsync } = useMutation({
    ...orpc.admin.subcategories.delete.mutationOptions(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orpc.admin.subcategories.key() });
    }
  });

  const isLoading = isPending || isDeleting;
  const columns = useMemo(() => subcategoryColumns({ disabled: isLoading }), [isLoading]);

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
      title: 'Delete subcategories',
      description: 'Are you sure you want to delete the selected subcategories?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });

    if (!isConfirmed)
      return;

    toast.promise(
      deleteAsync({ ids: selectedItems.map((i) => i.id) }),
      {
        loading: 'Deleting categories...',
        success: (result) => {
          return `Deleted ${result.deletedCount} subcategories.`;
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
      <CreateSubcategoryDialogProvider>
        <EditSubcategoryDialogProvider>

          <DataTableProvider table={table} loading={isPending}>
            <DataTableToolbar>
              <div className="flex-1"/>
              {selectedItems.length > 0 && (
                <Button size="sm" variant="ghost-destructive" onClick={deleteCategories} disabled={isLoading}>
                  <IconTrash/>
                  <span className="sr-only sm:not-sr-only">Delete</span>
                </Button>
              )}
              <CreateSubcategoryTrigger variant="ghost" size="sm" disabled={isPending} shortText/>
            </DataTableToolbar>

            <DataTable/>
            <DataTablePagination/>
          </DataTableProvider>

          <EditSubcategoryDialog/>
          <CreateSubcategoryDialog/>
        </EditSubcategoryDialogProvider>
      </CreateSubcategoryDialogProvider>
    </div>
  );
};