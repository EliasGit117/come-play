import z from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { queryOptions } from '@tanstack/react-query';
import { NewsDtoFactory } from '@/features/news/dtos/news-dto';
import { NewsStatus } from '@prisma/client';


export const getNewsBySlugSchema = z.object({
  slug: z.string()
});
export type TGetNewsBySlugParams = z.infer<typeof getNewsBySlugSchema>;

export const getNewsBySlug = createServerFn({ method: 'GET' })
  .inputValidator(getNewsBySlugSchema)
  .handler(async ({ data: { slug } }) => {
    const news = await prisma.news.findUnique({
      where: { slug: slug, status: NewsStatus.published },
      include: { image: true }
    });

    if (!news)
      throw new Error('Not Found');

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
