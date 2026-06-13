import { createFileRoute } from '@tanstack/react-router';
import { m } from '@/paraglide/messages';


export const Route = createFileRoute('/admin/customer-requests')({
  staticData: { breadcrumbs: { title: m['pages.admin.customerRequests.breadcrumbs.list']() } },
});
