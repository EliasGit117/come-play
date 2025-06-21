import { createFileRoute, Link, useLocation } from '@tanstack/react-router';
import { SignInCard } from '@/routes/(main)/auth/-components/sign-in-card';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/(main)/auth/sign-in')({
  component: RouteComponent
});

function RouteComponent() {
  const location = useLocation();

  return (
    <main className="container mx-auto p-4 space-y-2">
      <SignInCard className="mt-10 mx-auto"/>

      <Button size="sm" variant="link" className='mx-auto w-full text-muted-foreground' asChild>
        <Link to="/auth/sign-up">
          Don't have an account?
        </Link>
      </Button>
    </main>
  );
}
