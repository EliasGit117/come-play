import { createFileRoute, Link } from '@tanstack/react-router';
import { Card } from '@/components/ui/card';
import SolutionsBreadcrumb from './-components/solutions-breadcrumb';
import { SOLUTION_PROJECTS } from './-consts/projects';
import { tm } from './-lib/get-message';
import { seo } from '@/utils/seo';

export const Route = createFileRoute('/_public/solutions/')({
  component: RouteComponent,
  head: () => ({
    meta: seo({
      title: tm('pages.public.solutions.index.title'),
      description: tm('pages.public.solutions.index.subtitle')
    })
  })
});

function RouteComponent() {
  const title = tm('pages.public.solutions.index.title');
  const subtitle = tm('pages.public.solutions.index.subtitle');

  return (
    <main className="container mx-auto px-4 pb-16 pt-6 space-y-8">
      <SolutionsBreadcrumb/>

      <div>
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {SOLUTION_PROJECTS.map((project) => (
          <ProjectCard key={project.slug} slug={project.slug} itemKey={project.key} photo={project.photo}/>
        ))}
      </div>
    </main>
  );
}

interface IProjectCardProps {
  slug: string;
  itemKey: string;
  photo: string;
}

function ProjectCard({ slug, itemKey, photo }: IProjectCardProps) {
  const baseKey = `pages.public.solutions.items.${itemKey}`;
  const title = tm(`${baseKey}.title`);
  const client = tm(`${baseKey}.client`);

  return (
    <Link to="/solutions/$slug" params={{ slug }} className="group">
      <Card className="relative h-full p-0 gap-0 overflow-hidden border-border/50 transition-all hover:border-primary/50 aspect-3/2">
        <img
          alt={title}
          src={photo}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition duration-400 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent"/>
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 text-white">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-xs text-white/85 line-clamp-2">{client}</p>
        </div>
      </Card>
    </Link>
  );
}
