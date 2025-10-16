import { createFileRoute, Outlet } from '@tanstack/react-router';


export const Route = createFileRoute('/admin/news')({
  staticData: {
    breadcrumbs: [{ title: 'News' }]
  },
});


