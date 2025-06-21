import { createFileRoute } from '@tanstack/react-router'
import { ChangeEmailCard, SettingsCards } from '@daveyplate/better-auth-ui';

export const Route = createFileRoute('/(main)/auth/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className='container mx-auto'>
      <ChangeEmailCard />
    </main>
  )
}
