import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/banners')({
  staticData: {
    breadcrumbs: { title: 'Banners' }
  }
})
