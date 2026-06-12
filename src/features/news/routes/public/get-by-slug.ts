import { z } from 'zod';
import { type } from '@orpc/server';
import { NewsStatus } from '@prisma/client';
import prisma from '@/lib/prisma';
import { newsPublicBase, newsPublicPath } from './base';
import { INewsDto, NewsDtoFactory } from '@/features/news/dtos/news-dto';

export const getNewsBySlug = newsPublicBase
  .route({
    method: 'GET',
    path: `${newsPublicPath}/{slug}`,
    summary: 'Get news by slug',
    description: 'Returns a single published news by slug',
  })
  .meta({ anonymous: true })
  .errors({ NOT_FOUND: {} })
  .input(z.object({ slug: z.string() }))
  .output(type<INewsDto>())
  .handler(async ({ input: { slug }, errors }) => {
    const news = await prisma.news.findUnique({
      where: { slug: slug, status: NewsStatus.published },
      include: { image: true },
    });

    if (!news)
      throw errors.NOT_FOUND();

    return NewsDtoFactory.fromEntity(news);
  });
