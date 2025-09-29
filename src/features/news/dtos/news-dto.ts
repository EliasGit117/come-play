import { News } from '@prisma/client';

export interface INewsDto {
  id: number;
  slug: string;
  title: string;
  content?: string | null;
  createdAt: string;
}

export class NewsDtoFactory {

  static fromEntity(entity: News): INewsDto {
    return {
      id: entity.id,
      title: entity.titleRo,
      slug: entity.slug,
      createdAt: entity.createdAt.toISOString(),
      content: entity.contentRo,
    };
  }


  static fromEntities(entities: News[]): INewsDto[] {
    return entities.map(entity => this.fromEntity(entity));
  }
}