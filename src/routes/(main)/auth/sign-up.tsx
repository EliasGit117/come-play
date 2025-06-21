import { createFileRoute, Link, useLocation } from '@tanstack/react-router';
import { SignUpCard } from '@/routes/(main)/auth/-components/sign-up-card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const Route = createFileRoute('/(main)/auth/sign-up')({
  component: RouteComponent
});

function RouteComponent() {
  const location = useLocation();

  return (
    <main className="container mx-auto p-4 space-y-2">
      <SignUpCard className="mt-10 mx-auto"/>

      <Button size="sm" variant="link" className="mx-auto w-full text-muted-foreground" asChild>
        <Link to="/auth/sign-in">
          Already have an account?
        </Link>
      </Button>
    </main>
  );
}