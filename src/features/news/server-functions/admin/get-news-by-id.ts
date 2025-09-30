import z from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { queryOptions } from '@tanstack/react-query';
import { IAdminNewsDtoFactory } from '@/features/news/dtos/admin-news-dto';


export const getNewsByIdSchema = z.object({
  id: z.number()
});
export type TGetNewsByIdParams = z.infer<typeof getNewsByIdSchema>;

export const getNewsById = createServerFn({ method: 'GET' })
  .inputValidator(getNewsByIdSchema)
  .handler(async ({ data: { id } }) => {
    const news = await prisma.news.findUnique({
      where: { id },
      include: {
        image: true
      }
    });

    if (!news)
      throw new Error('News not found');

    return IAdminNewsDtoFactory.fromEntity(news);
  });

export function getNewsByIdQueryOptions(id: number | string) {
  const parsedId = typeof id === "string" ? z.coerce.number().parse(id) : id;

  return queryOptions({
    queryKey: ['news', id],
    queryFn: () => getNewsById({ data: { id: parsedId } }),
    staleTime: 10_000
  });
}
