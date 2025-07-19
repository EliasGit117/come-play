import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/news')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className='container mx-auto p-4 space-y-4'>
      <p>News</p>
      <div className='min-h-[2000px]'/>
    </main>
  )
}
