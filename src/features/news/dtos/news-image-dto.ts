import { NewsImage } from '@prisma/client';


export interface INewsImageDto {
  url: string;
  thumbhash?: string;
  type: string;
  width?: number;
  height?: number;
}

export class NewsImageDtoFactory {

  static fromEntity(entity: NewsImage): INewsImageDto {
    return {
      url: entity.url,
      thumbhash: !!entity.thumbhash ? Buffer.from(entity.thumbhash).toString("base64") : undefined,
      height: entity.height ?? undefined,
      width: entity.width ?? undefined,
      type: entity.type,
    };
  }

  static fromEntities(entities: NewsImage[]): INewsImageDto[] {
    return entities.map(entity => this.fromEntity(entity));
  }
}