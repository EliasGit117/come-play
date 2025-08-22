import z from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { queryOptions } from '@tanstack/react-query';
import { NewsDtoFactory } from '@/features/news/dtos/news-dto';

export const getNewsBySlugSchema = z.object({
  slug: z.string()
});
export type TGetNewsBySlugParams = z.infer<typeof getNewsBySlugSchema>;

export const getNewsBySlug = createServerFn({ method: 'GET' })
  .validator(getNewsBySlugSchema)
  .handler(async ({ data: { slug } }) => {
    const news = await prisma.news.findUnique({
      where: { slug: slug },
    });

    if (!news) {
      throw new Error('News not found');
    }

    return NewsDtoFactory.fromEntity(news);
  });

// React Query options
export function getNewsBySlugQueryOptions(slug: string) {
  return queryOptions({
    queryKey: ['news', slug],
    queryFn: () => getNewsBySlug({ data: { slug: slug } }),
    staleTime: 10_000
  });
}
