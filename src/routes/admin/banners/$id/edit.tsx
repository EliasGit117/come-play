import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/banners/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/banners/$id/edit"!</div>
}
