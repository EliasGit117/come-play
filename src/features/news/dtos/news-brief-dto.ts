import { News } from '@prisma/client';

export class NewsBriefDto {
  title: string;
  link: string;

  constructor(params: NewsBriefDto) {
    this.title = params.title;
    this.link = params.link;
  }

  static fromEntity(news: News): NewsBriefDto {
    return new NewsBriefDto({
      title: news.title,
      link: news.link,
    });
  }
}