import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button';
export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="container mx-auto p-4">
      <h3>Welcome Home!!!</h3>
      <Button>
        Button
      </Button>
    </main>
  )
}
