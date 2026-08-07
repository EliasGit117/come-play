import { createFileRoute, notFound } from '@tanstack/react-router';
import { NotFoundCard } from '@/components/not-found-card';
import CaseStudy from './-components/case-study';
import ProjectsBreadcrumb from './-components/projects-breadcrumb';
import { getSolutionProject } from './-consts/projects';
import { tm } from './-lib/get-message';
import { seo } from '@/utils/seo';
import { htmlToExcerpt } from '@/utils/text';

export const Route = createFileRoute('/_public/projects/$slug')({
  component: RouteComponent,
  loader: ({ params: { slug } }) => {
    const project = getSolutionProject(slug);
    if (!project) throw notFound();

    return project;
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return {};

    const baseKey = `pages.public.solutions.items.${loaderData.key}`;

    return {
      meta: seo({
        title: tm(`${baseKey}.title`),
        description: htmlToExcerpt(tm(`${baseKey}.description`))
      })
    };
  },
  notFoundComponent: () => <NotFoundCard/>
});

function RouteComponent() {
  const project = Route.useLoaderData();
  const baseKey = `pages.public.solutions.items.${project.key}`;
  const title = tm(`${baseKey}.title`);

  return (
    <main className="container mx-auto px-4 pb-16 pt-6 space-y-8">
      <ProjectsBreadcrumb current={title}/>

      <CaseStudy baseKey={baseKey} media={project}/>
    </main>
  );
}
