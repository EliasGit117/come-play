import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { authQueries, authQueryKeys } from '@/features/auth/queries';
import { router } from 'better-auth/api';

export const Route = createFileRoute('/admin/')({
  component: RouteComponent
});

function RouteComponent() {
  const { userSession } = Route.useRouteContext();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: () => authClient.signOut().then(() => {
      queryClient.invalidateQueries({
        queryKey: [authQueryKeys.getUser]
      }).then(() => {
        return router.invalidate();
      });
    })
  });


  return (
    <main className="container mx-auto px-4">
      <p>{userSession?.user.email}</p>

      {userSession && (
        <Button disabled={isPending} onClick={() => mutate()}>
          Logout
        </Button>
      )}
    </main>
  );
}
