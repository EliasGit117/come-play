import { createFileRoute } from '@tanstack/react-router';
import {
  getNewsByIdQueryOptions,
} from '@/features/news/server-functions/get-news-by-id';
import { useSuspenseQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/admin/news/$id/edit')({
  component: RouteComponent,
  loader: async ({ params: { id }, context }) => {
    const data = await context.queryClient.ensureQueryData(getNewsByIdQueryOptions(id));
    return { post: data };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: `Edit ${loaderData.post.title}` }] : undefined
  })
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(getNewsByIdQueryOptions(id))

  return (
    <main className="container mx-auto p-4 space-y-4 flex flex-col flex-1">
      <p>{data.title}</p>
    </main>
  )
}
