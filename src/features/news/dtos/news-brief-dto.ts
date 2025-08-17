import { News } from '@prisma/client';

export interface INewsBriefDto {
  id: number;
  title: string;
  link: string;
  createdAt: string; // ISO string for safe serialization
}

export class NewsBriefDtoFactory {
  static fromEntity(news: News): INewsBriefDto {
    return {
      id: news.id,
      title: news.titleRo,
      link: news.link,
      createdAt: news.createdAt.toISOString(),
    };
  }

  static fromEntities(newsArray: News[]): INewsBriefDto[] {
    return newsArray.map(news => this.fromEntity(news));
  }
}
