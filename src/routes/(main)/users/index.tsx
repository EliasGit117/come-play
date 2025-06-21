import { createFileRoute, Link } from '@tanstack/react-router';
import { usersQueryOptions } from '@/utils/users';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';


export const Route = createFileRoute('/(main)/users/')({
  component: UsersIndexPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(usersQueryOptions());
  },
  head: () => ({
    meta: [{ title: 'Users' }],
  }),
});

function UsersIndexPage() {
  const usersQuery = useSuspenseQuery(usersQueryOptions());
  const userList =
    [...usersQuery.data, { id: 'i-do-not-exist', name: 'Non-existent User', email: '' }];

  return (
    <main className="container mx-auto p-4">
      <ul className='-ml-1 space-y-2'>
        {userList.map((user) =>
          <li key={user.id} className="whitespace-nowrap">
            <Button variant="link" size='dense' asChild>
              <Link to="/users/$userId" params={{ userId: `${user.id}` }}>
                {user.name}
              </Link>
            </Button>
          </li>
        )}
      </ul>
    </main>
  );
}
