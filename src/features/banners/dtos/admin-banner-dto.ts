import { Banner, Prisma } from '@prisma/client';
import { AdminBannerImageDtoFactory, IAdminBannerImageDto } from '@/features/banners/dtos/admin-banner-image-dto';

type TBannerWithImages = Prisma.BannerGetPayload<{
  include: { desktopImage: true; tabletImage: true; mobileImage: true }
}>

export interface IAdminBannerDto {
  id: number;
  titleRo: string;
  titleRu: string;
  link: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  desktopImage?: IAdminBannerImageDto;
  tabletImage?: IAdminBannerImageDto;
  mobileImage?: IAdminBannerImageDto;
}

export class IAdminBannerDtoFactory {

  private static baseFromEntity(entity: Banner): Omit<IAdminBannerDto, 'desktopImage' | 'tabletImage' | 'mobileImage'> {
    return {
      id: entity.id,
      titleRo: entity.titleRo,
      titleRu: entity.titleRu,
      link: entity.link,
      order: entity.order,
      isActive: entity.isActive,
      createdAt: entity.createdAt.toISOString()
    };
  }

  static fromEntity<T extends Banner | TBannerWithImages>(entity: T): IAdminBannerDto {
    const dto: IAdminBannerDto = this.baseFromEntity(entity);

    if ('desktopImage' in entity && entity.desktopImage)
      dto.desktopImage = AdminBannerImageDtoFactory.fromEntity(entity.desktopImage);

    if ('tabletImage' in entity && entity.tabletImage)
      dto.tabletImage = AdminBannerImageDtoFactory.fromEntity(entity.tabletImage);

    if ('mobileImage' in entity && entity.mobileImage)
      dto.mobileImage = AdminBannerImageDtoFactory.fromEntity(entity.mobileImage);

    return dto;
  }

  static fromEntities<T extends Banner | TBannerWithImages>(entities: T[]): IAdminBannerDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}