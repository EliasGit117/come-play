import z from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { queryOptions } from '@tanstack/react-query';
import { NewsDto } from '@/features/news/dtos/news-dto';

// Schema
export const getNewsByIdSchema = z.object({
  id: z.number()
});
export type TGetNewsByIdParams = z.infer<typeof getNewsByIdSchema>;

// Server function
export const getNewsById = createServerFn({ method: 'GET' })
  .validator(getNewsByIdSchema)
  .handler(async ({ data: { id } }) => {
    const news = await prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      throw new Error('News not found');
    }

    return NewsDto.fromEntity(news);
  });

// React Query options
export function getNewsByIdQueryOptions(id: number | string) {
  const parsedId = typeof id === "string" ? z.coerce.number().parse(id) : id;

  return queryOptions({
    queryKey: ['news', id],
    queryFn: () => getNewsById({ data: { id: parsedId } }),
    staleTime: 10_000
  });
}
