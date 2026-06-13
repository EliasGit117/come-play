import { createFileRoute } from '@tanstack/react-router';


export const Route = createFileRoute('/admin/customer-requests')({
  staticData: { breadcrumbs: { title: 'Customer Requests' } },
});
