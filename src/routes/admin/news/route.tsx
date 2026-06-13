import { createFileRoute } from '@tanstack/react-router';
import { m } from '@/paraglide/messages';


export const Route = createFileRoute('/admin/news')({
  staticData: { breadcrumbs: { title: m['pages.admin.news.breadcrumbs.list']() } },
});


