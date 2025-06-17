import { createFileRoute, Link } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { postsQueryOptions } from '@/utils/posts';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/posts/')({
  component: PostsIndexComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(postsQueryOptions());
  },
  head: () => ({
    meta: [{ title: 'Posts' }]
  })
});

function PostsIndexComponent() {
  const postsQuery = useSuspenseQuery(postsQueryOptions());
  const postList = [...postsQuery.data, { id: 'i-do-not-exist', title: 'Non-existent Post' }];

  return (
    <main className="container mx-auto p-4">
      <ul className="-ml-1 space-y-2">
        {postList.map((post) =>
          <li key={post.id} className="whitespace-nowrap">
            <Button variant="link" size="dense" className="whitespace-pre-line" asChild>
              <Link to="/posts/$postId" params={{ postId: `${post.id}` }}>
                {post.title}
              </Link>
            </Button>
          </li>
        )}
      </ul>
    </main>
  );
}
