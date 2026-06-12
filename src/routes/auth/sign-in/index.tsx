import { createFileRoute, redirect } from '@tanstack/react-router';
import { SignInCard } from '@/components/auth/sign-in-card';

export const Route = createFileRoute('/auth/sign-in/')({
  component: RouteComponent,
  staticData: { hideBreadcrumbs: true },
  beforeLoad: ({ context }) => {
    if (context.session)
      throw redirect({ to: '/admin' });
  },
  head: () => ({ meta: [{ title: 'Sign in' }] }),
});

function RouteComponent() {
  return (
    <main className="w-full flex-1 flex flex-col items-center justify-center p-4 min-h-svh">
      <SignInCard className="-mt-20" />
    </main>
  );
}
