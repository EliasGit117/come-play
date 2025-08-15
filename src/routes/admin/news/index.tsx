"use no memo";

import { Button } from '@/components/ui/button';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { RotateCcwIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { zodValidator } from '@tanstack/zod-adapter';
import {
  DataTable,
  DataTablePagination,
  DataTableProvider,
  DataTableToolbar,
  useDataTable
} from '@/components/data-table';
import {
  getNewsPaginatedQueryOptions,
  getNewsPaginatedSchema
} from '@/features/news/server-functions/get-news-paginated';
import { newsDataTableColumns } from '@/routes/admin/news/-components/news-data-table-columns';


export const Route = createFileRoute('/admin/news/')({
  component: Component,
  validateSearch: zodValidator(getNewsPaginatedSchema),
  loaderDeps: (deps) => (deps),
  loader: async ({ context, deps: { search } }) => {
    return context.queryClient.prefetchQuery(getNewsPaginatedQueryOptions(search));
  },
  head: () => {
    return {
      meta: [{ title: 'Posts' }]
    };
  }
});

function Component() {
  const search = Route.useSearch();
  const { data, isPending, refetch } = useQuery({
    ...getNewsPaginatedQueryOptions(search),
    placeholderData: keepPreviousData
  });

  const { table } = useDataTable({
    data: data?.items,
    page: data?.page,
    limit: search.limit,
    total: data?.totalCount,
    totalPages: data?.pageCount,
    columns: newsDataTableColumns
  });

  return (
    <main className="container mx-auto p-4 space-y-4 flex flex-col flex-1">
      <p className="text-sm text-muted-foreground">
        {JSON.stringify(search, undefined, 2)}
      </p>

      <article className="space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl">
            Title
          </h2>

          <div className="flex-1"/>

          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="smIcon" onClick={() => refetch()} disabled={isPending}>
                <RotateCcwIcon/>
              </Button>
            </TooltipTrigger>

            <TooltipContent><p>Refresh</p></TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="smIcon" asChild>
                {/*<Link to="/admin/posts/create">*/}
                {/*  <PlusIcon/>*/}
                {/*</Link>*/}
              </Button>
            </TooltipTrigger>

            <TooltipContent>
              <p>Create</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </article>

      <DataTableProvider table={table}>
        <DataTableToolbar/>
        <DataTable/>
        <DataTablePagination/>
      </DataTableProvider>
    </main>
  );
}