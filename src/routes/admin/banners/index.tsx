import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import {
  getBannersForAdminQueryOptions,
  getBannersForAdminSchema
} from '@/features/banners/server-functions/admin/get-banners-for-admin';
import { BannerTable } from '@/routes/admin/banners/-components/banners-table';


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

  return (
    <main className="container mx-auto p-4 space-y-4 flex flex-col flex-1">
      <BannerTable search={search}/>
    </main>
  );
}
