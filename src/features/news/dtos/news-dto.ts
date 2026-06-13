import { News, Prisma } from '@prisma/client';
import { AdminNewsImageDtoFactory, IAdminNewsImageDto } from '@/features/news/dtos/admin-news-image-dto';
import { Locale } from '@/paraglide/runtime';
import { capitalizeFirst } from '@/utils/text';


type TNewsWithImage = Prisma.NewsGetPayload<{ include: { image: true } }>

export interface INewsDto {
  id: number;
  slug: string;
  title: string;
  content?: string | null;
  createdAt: string;
  image?: IAdminNewsImageDto;
}

export class NewsDtoFactory {

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