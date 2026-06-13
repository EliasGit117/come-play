import { News, Prisma } from '@prisma/client';
import { AdminNewsImageDtoFactory } from '@/features/news/dtos/admin-news-image-dto';
import { INewsDto } from '@/features/news/dtos/news-dto';
import { INewsImageDto } from '@/features/news/dtos/news-image-dto';
import { Locale } from '@/paraglide/runtime';
import { capitalizeFirst } from '@/utils/text';


type TNewsWithImage = Prisma.NewsGetPayload<{ include: { image: true } }>;

export interface INewsBriefDto {
  id: number;
  title: string;
  slug: string;
  createdAt: string;
  image?: INewsImageDto;
}

export class NewsBriefDtoFactory {

  private static baseFromEntity(entity: News, locale: Locale): Omit<INewsDto, 'image'> {

    return {
      id: entity.id,
      slug: entity.slug,
      title: entity[`title${capitalizeFirst(locale)}`],
      content: entity[`content${capitalizeFirst(locale)}`],
      createdAt: entity.createdAt.toISOString()
    };
  }

  static fromEntity<T extends News | TNewsWithImage>(entity: T, locale: Locale): INewsDto {
    const dto: INewsDto = this.baseFromEntity(entity, locale);
    if ('image' in entity && entity.image)
      dto.image = AdminNewsImageDtoFactory.fromEntity(entity.image);

    return dto;
  }

  static fromEntities<T extends News | TNewsWithImage>(entities: T[], locale: Locale): INewsDto[] {
    return entities.map((entity) => this.fromEntity(entity, locale));
  }
}

