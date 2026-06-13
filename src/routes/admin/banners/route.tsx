import { createFileRoute } from '@tanstack/react-router'
import { m } from '@/paraglide/messages';

export const Route = createFileRoute('/admin/banners')({
  staticData: {
    breadcrumbs: { title: m['pages.admin.banners.breadcrumbs.list']() }
  }
})
