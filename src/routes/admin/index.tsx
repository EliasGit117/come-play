import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Dashboard' }] }),
  staticData: {
    breadcrumbs: { title: 'Dashboard' }
  },
})

function RouteComponent() {
  return (
    <main className='container mx-auto px-4'>
      <p>Here will be dashboard</p>
    </main>
  )
}
