import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/banners/')({
  component: RouteComponent,
  staticData: {
    breadcrumbs: [{ title: 'Banners' }]
  }
})

function RouteComponent() {
  return <div>Hello "/admin/banners/"!</div>
}
