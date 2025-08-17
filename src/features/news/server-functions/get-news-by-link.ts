import z from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { queryOptions } from '@tanstack/react-query';
import { NewsDto } from '@/features/news/dtos/news-dto';

export const getNewsByLinkSchema = z.object({
  link: z.string()
});
export type TGetNewsByLinkParams = z.infer<typeof getNewsByLinkSchema>;

export const getNewsByLink = createServerFn({ method: 'GET' })
  .validator(getNewsByLinkSchema)
  .handler(async ({ data: { link } }) => {
    const news = await prisma.news.findUnique({
      where: { link },
    });

    if (!news) {
      throw new Error('News not found');
    }

    return NewsDto.fromEntity(news);
  });

// React Query options
export function getNewsByLinkQueryOptions(link: string) {
  return queryOptions({
    queryKey: ['news', link],
    queryFn: () => getNewsByLink({ data: { link: link } }),
    staleTime: 10_000
  });
}
