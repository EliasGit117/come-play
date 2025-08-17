import { News } from '@prisma/client';

export class NewsDto {
  id: number;
  title: string;
  link: string;
  content: string | null;
  createdAt: string;

  constructor(params: NewsDto) {
    this.id = params.id;
    this.title = params.title;
    this.link = params.link;
    this.createdAt = params.createdAt;
    this.content = params.content;
  }

  static fromEntity(news: News): NewsDto {
    return new NewsDto({
      id: news.id,
      title: news.titleRo,
      link: news.link,
      createdAt: news.createdAt.toISOString(),
      content: news.contentRo,
    });
  }
}