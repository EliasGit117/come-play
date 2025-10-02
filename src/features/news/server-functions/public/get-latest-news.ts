import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { queryOptions } from '@tanstack/react-query';
import { NewsStatus } from '@prisma/client';
import { NewsBriefDtoFactory } from '@/features/news/dtos/news-brief-dto';


export const getLatestNews = createServerFn({ method: 'GET' })
  .handler(async () => {
    const items = await prisma.news.findMany({
      where: { status: { equals: NewsStatus.published } },
      orderBy: { createdAt: 'desc' },
      include: { image: true },
      take: 4
    });

    return NewsBriefDtoFactory.fromEntities(items);
  });


export function getLatestNewsQueryOptions() {
  return queryOptions({
    queryKey: ['news', 'latest'],
    queryFn: () => getLatestNews(),
    staleTime: 30_000,
    gcTime: 30_000
  });
}
