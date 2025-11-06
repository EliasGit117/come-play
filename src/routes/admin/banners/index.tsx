import { createFileRoute } from '@tanstack/react-router';
import AdaptiveButton from '@/components/ui/adaptive-button';
import { FilePlus2Icon, ListStartIcon, RotateCcwIcon } from 'lucide-react';
import { useState } from 'react';
import { zodValidator } from '@tanstack/zod-adapter';
import {
  getBannersForAdminQueryOptions,
  getBannersForAdminSchema
} from '@/features/banners/server-functions/admin/get-banners-paginagted-for-admin';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { bannerColumns, BannerTable } from '@/routes/admin/banners/-components/banners-table';
import {
  DeleteBannerAlertDialogProvider
} from '@/routes/admin/banners/-components/delete-banner-alert-dialog/provider';
import { useDataTable } from '@/components/data-table';
import { DeleteBannerAlertDialog } from '@/routes/admin/banners/-components/delete-banner-alert-dialog/alert-dialog';
import CreateBannerDialog from '@/routes/admin/banners/-components/create-banner-dialog';


export const Route = createFileRoute('/admin/banners/')({
  component: RouteComponent,
  validateSearch: zodValidator(getBannersForAdminSchema),
  loaderDeps: (deps) => deps,
  loader: async ({ context, deps: { search } }) => {
    return context.queryClient.prefetchQuery(getBannersForAdminQueryOptions(search));
  },
  head: () => {
    return { meta: [{ title: 'Banners' }] };
  }
});

function RouteComponent() {
  'use no memo';

  const search = Route.useSearch();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data, isPending, refetch } = useQuery({
    ...getBannersForAdminQueryOptions(search),
    placeholderData: keepPreviousData
  });

  const { table } = useDataTable({
    data: data,
    page: 1,
    limit: 10,
    total: data?.length,
    totalPages: 1,
    columns: bannerColumns,
    pageOnSearchChange: 'none',
    initialState: {
      columnVisibility: {
        id: false,
        updatedAt: false,
        createdAt: false
      },
      columnPinning: {
        right: ['actions']
      }
    }
  });

  const refetchSync = () => refetch();
  const openCreateDialog = () => setCreateDialogOpen(true);

  return (
    <DeleteBannerAlertDialogProvider>
      <main className="container mx-auto p-4 space-y-4 flex flex-col flex-1">
        <BannerTable
          table={table}
          isPending={isPending}
          topToolbarChildren={
            <>
              <div className="flex-1"/>
              <AdaptiveButton
                variant="ghost"
                size="sm"
                disabled={isPending}
                icon={ListStartIcon}
                text="Reorder"
              />
              <AdaptiveButton
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={openCreateDialog}
                icon={FilePlus2Icon}
                text="Create"
              />
              <AdaptiveButton
                variant="ghost"
                size="sm"
                onClick={refetchSync}
                disabled={isPending}
                icon={RotateCcwIcon}
                text="Refresh"
              />
            </>
          }
        />

        <CreateBannerDialog open={createDialogOpen} setOpen={setCreateDialogOpen}/>
        <DeleteBannerAlertDialog/>
      </main>
    </DeleteBannerAlertDialogProvider>
  );
}
