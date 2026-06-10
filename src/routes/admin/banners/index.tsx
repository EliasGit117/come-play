import { createFileRoute } from '@tanstack/react-router';
import {
  getBannersForAdminQueryOptions,
  getBannersForAdminSchema
} from '@/features/banners/server-functions/admin/get-banners-for-admin';
import { BannerTable } from '@/routes/admin/banners/-components/banners-table';
import { awaitIfServer } from '@/lib/await-if-server';


export const Route = createFileRoute('/admin/banners/')({
  component: RouteComponent,
  validateSearch: getBannersForAdminSchema,
  loaderDeps: (deps) => deps,
  loader: async ({ context, deps: { search } }) => {
    await awaitIfServer(context.queryClient.prefetchQuery(getBannersForAdminQueryOptions(search)));
  },
  head: () => {
    return { meta: [{ title: 'Banners' }] };
  }
});

function RouteComponent() {
  'use no memo';

  const search = Route.useSearch();

  return (
    <main className="container mx-auto p-4 space-y-4 flex flex-col flex-1">
      <BannerTable search={search}/>
    </main>
  );
}
