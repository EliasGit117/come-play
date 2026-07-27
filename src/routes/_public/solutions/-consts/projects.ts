export interface SolutionProjectConfig {
  slug: string;
  /** key under pages.public.solutions.items.{key} */
  key: string;
  photo: string;
  video: string;
  /** crops out letterboxing baked into the source video */
  videoScale?: number;
}

export const SOLUTION_PROJECTS: SolutionProjectConfig[] = [
  {
    slug: 'led-walls',
    key: 'ledWalls',
    photo: '/images/solutions/case-studies/led-walls.webp',
    video: '/videos/solutions/led-walls.mp4',
    videoScale: 1.4
  },
  {
    slug: 'mobile-solutions',
    key: 'mobileSolutions',
    photo: '/images/solutions/case-studies/mobile-solutions.webp',
    video: '/videos/solutions/mobile-solutions.mp4'
  },
  {
    slug: 'outdoor-storefront',
    key: 'outdoorStorefront',
    photo: '/images/solutions/case-studies/outdoor-storefront.webp',
    video: '/videos/solutions/outdoor-storefront.mp4'
  },
  {
    slug: 'media-facades',
    key: 'mediaFacades',
    photo: '/images/solutions/case-studies/media-facades.webp',
    video: '/videos/solutions/media-facades.mp4',
    videoScale: 1.4
  }
];

export const getSolutionProject = (slug: string) =>
  SOLUTION_PROJECTS.find((project) => project.slug === slug);
