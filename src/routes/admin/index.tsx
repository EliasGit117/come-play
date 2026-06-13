import { createFileRoute } from '@tanstack/react-router'
import { m } from '@/paraglide/messages';

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: m['pages.admin.dashboard.title']() }] }),
  staticData: {
    breadcrumbs: { title: m['pages.admin.dashboard.title']() }
  },
})

function RouteComponent() {
  return (
    <main className='container mx-auto px-4'>
      <p>{m['pages.admin.dashboard.placeholder']()}</p>
    </main>
  )
}
