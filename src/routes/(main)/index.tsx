import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useMutation } from '@tanstack/react-query';
import { router } from 'better-auth/api';

export const Route = createFileRoute('/(main)/')({
  component: Home
});

function Home() {

  return (
    <main className="container mx-auto p-4 space-y-2">
      <h3>Welcome Home!!!</h3>

    </main>
  );
}
