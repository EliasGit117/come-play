import { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { m } from '@/paraglide/messages';
import { SOLUTION_PROJECTS } from '@/routes/_public/projects/-consts/projects';
import { tm } from '@/routes/_public/projects/-lib/get-message';


interface IProps extends ComponentProps<'section'> {
}

interface IProjectCard {
  slug: string;
  title: string;
  subtitle: string;
  img: string;
  video: string;
  videoScale?: number;
}

const ProjectList: FC<IProps> = ({ className, ...props }) => {
  const projects: IProjectCard[] = SOLUTION_PROJECTS.map((project) => ({
    slug: project.slug,
    title: tm(`pages.public.solutions.items.${project.key}.title`),
    subtitle: tm(`pages.public.solutions.items.${project.key}.client`),
    img: project.photo,
    video: project.video,
    videoScale: project.videoScale
  }));

  return (
    <section className={cn('space-y-8', className)} {...props}>
      <div>
        <h2 className="text-3xl font-bold">
          {m['pages.public.home.solutions.title']()}
        </h2>
        <p className="text-muted-foreground mt-2">
          {m['pages.public.home.solutions.subtitle']()}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
        {projects.map((project) => (
          <CategoryCard key={project.slug} {...project}/>
        ))}
      </div>
    </section>
  );
};


const CategoryCard: FC<IProjectCard> = ({ slug, title, subtitle, img, video, videoScale }) => {
  return (
    <Link
      to="/projects/$slug"
      params={{ slug }}
      className="group relative flex h-80 flex-col justify-end overflow-hidden rounded-md border border-border/50"
    >
      <div
        className="absolute inset-0"
        style={videoScale ? { transform: `scale(${videoScale})` } : undefined}
      >
        <video
          src={video}
          poster={img}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          disablePictureInPicture
          disableRemotePlayback
          className={cn(
            'h-full w-full object-cover brightness-90 dark:brightness-75',
            'transition duration-400 ease-in-out group-hover:scale-110'
          )}
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-black/30 via-black/10 to-transparent"/>
      <div className="relative space-y-1 p-4 text-white max-w-md">
        <h3 className="text-xl font-semibold uppercase">{title}</h3>
      </div>
    </Link>
  );
};

export default ProjectList;
