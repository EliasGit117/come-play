import { createFileRoute } from '@tanstack/react-router';
import AdaptiveButton from '@/components/ui/adaptive-button';
import { FilePlus2Icon, ListStartIcon, RotateCcwIcon } from 'lucide-react';
import CreateBannerDialog from '@/routes/admin/banners/-components/create-banner-dialog/dialog';
import { useState } from 'react';
import { zodValidator } from '@tanstack/zod-adapter';
import {
  getBannersPaginatedForAdminQueryOptions,
  getBannersPaginatedForAdminSchema
} from '@/features/banners/server-functions/admin/get-banners-paginagted-for-admin';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { bannerColumns, BannerTable } from '@/routes/admin/banners/-components/banners-table';
import {
  DeleteBannerAlertDialogProvider
} from '@/routes/admin/banners/-components/delete-banner-alert-dialog/provider';
import { useDataTable } from '@/components/data-table';
import { DeleteBannerAlertDialog } from '@/routes/admin/banners/-components/delete-banner-alert-dialog/alert-dialog';
import {
  ReorderBannerSheet,
  ReorderBannerSheetProvider,
  ReorderBannerSheetTrigger
} from '@/routes/admin/banners/-components/reorder-banners';


export const Route = createFileRoute('/admin/banners/')({
  component: RouteComponent,
  validateSearch: zodValidator(getBannersPaginatedForAdminSchema),
  loaderDeps: (deps) => deps,
  loader: async ({ context, deps: { search } }) => {
    return context.queryClient.prefetchQuery(getBannersPaginatedForAdminQueryOptions(search));
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
    ...getBannersPaginatedForAdminQueryOptions(search),
    placeholderData: keepPreviousData
  });

  const { table } = useDataTable({
    data: data?.items,
    page: data?.page,
    limit: search.limit,
    total: data?.totalCount,
    totalPages: data?.pageCount,
    columns: bannerColumns,
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
      <ReorderBannerSheetProvider>

        <main className="container mx-auto p-4 space-y-4 flex flex-col flex-1">
          <BannerTable
            table={table}
            topToolbarChildren={
              <>
                <div className="flex-1"/>
                <ReorderBannerSheetTrigger>
                  <AdaptiveButton
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    icon={ListStartIcon}
                    text="Reorder"
                  />
                </ReorderBannerSheetTrigger>
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

          <ReorderBannerSheet/>
          <CreateBannerDialog open={createDialogOpen} setOpen={setCreateDialogOpen}/>
          <DeleteBannerAlertDialog/>
        </main>

      </ReorderBannerSheetProvider>
    </DeleteBannerAlertDialogProvider>
  );
}
