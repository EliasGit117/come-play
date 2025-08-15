import { News } from '@prisma/client';

export class NewsBriefDto {
  id: number;
  title: string;
  link: string;
  createdAt: Date;

  constructor(params: NewsBriefDto) {
    this.id = params.id;
    this.title = params.title;
    this.link = params.link;
    this.createdAt = params.createdAt;
  }

  static fromEntity(news: News): NewsBriefDto {
    return new NewsBriefDto({
      id: news.id,
      title: news.titleRo,
      link: news.link,
      createdAt: news.createdAt
    });
  }
}