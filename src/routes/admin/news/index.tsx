import { DeleteNewsAlertDialogProvider } from '@/routes/admin/news/-components/delete-news-alert-dialog/provider';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { PlusIcon, RotateCcwIcon } from 'lucide-react';
import { zodValidator } from '@tanstack/zod-adapter';
import { useDataTable } from '@/components/data-table';
import {
  getNewsPaginatedForAdminQueryOptions,
  getNewsPaginatedForAdminSchema
} from '@/features/news/server-functions/admin/get-news-paginated-for-admin';
import { useState } from 'react';
import { CreateNewsDialog } from '@/routes/admin/news/-components/create-news-dialog/dialog';
import ButtonWithTooltip from '@/components/ui/button-with-tooltip';
import { newsColumns, NewsTable } from './-components/news-table';
import { DeleteNewsAlertDialog } from '@/routes/admin/news/-components/delete-news-alert-dialog/alert-dialog';


export const Route = createFileRoute('/admin/news/')({
  component: Component,
  validateSearch: zodValidator(getNewsPaginatedForAdminSchema),
  loaderDeps: (deps) => (deps),
  loader: async ({ context, deps: { search } }) => {
    return context.queryClient.prefetchQuery(getNewsPaginatedForAdminQueryOptions(search));
  },
  head: () => {
    return {
      meta: [{ title: 'News' }]
    };
  }
});

function Component() {
  // noinspection BadExpressionStatementJS
  "use no memo";

  const search = Route.useSearch();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data, isPending, refetch } = useQuery({
    ...getNewsPaginatedForAdminQueryOptions(search),
    placeholderData: keepPreviousData
  });

  const { table } = useDataTable({
    data: data?.items,
    page: data?.page,
    limit: search.limit,
    total: data?.totalCount,
    totalPages: data?.pageCount,
    columns: newsColumns
  });

  const refetchSync = () => refetch();
  const openCreateDialog = () => setCreateDialogOpen(true);

  return (
    <DeleteNewsAlertDialogProvider>

      <main className="container mx-auto p-4 space-y-4 flex flex-col flex-1">
        <article className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl">News</h2>

            <div className="flex-1"/>

            <ButtonWithTooltip
              variant="ghost"
              size="smIcon"
              tooltip="Create"
              disabled={isPending}
              onClick={openCreateDialog}
            >
              <PlusIcon/>
            </ButtonWithTooltip>

            <ButtonWithTooltip
              variant="ghost"
              size="smIcon"
              tooltip="Refresh"
              onClick={refetchSync} disabled={isPending}
            >
              <RotateCcwIcon/>
            </ButtonWithTooltip>
          </div>
        </article>

        <NewsTable table={table}/>

        <CreateNewsDialog open={createDialogOpen} setOpen={setCreateDialogOpen}/>
        <DeleteNewsAlertDialog/>
      </main>
    </DeleteNewsAlertDialogProvider>
  );
}
