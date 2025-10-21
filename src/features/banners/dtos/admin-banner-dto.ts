import { Banner, Prisma } from '@prisma/client';
import { AdminBannerImageDtoFactory, IAdminBannerImageDto } from '@/features/banners/dtos/admin-banner-image-dto';

type TBannerWithImages = Prisma.BannerGetPayload<{
  include: { desktopImage: true; tabletImage: true; mobileImage: true }
}>

export interface IAdminBannerDto {
  id: number;
  title: string;
  titleRo?: string;
  titleRu?: string;
  textRo?: string;
  textRu?: string;
  path: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  desktopImage?: IAdminBannerImageDto;
  tabletImage?: IAdminBannerImageDto;
  mobileImage?: IAdminBannerImageDto;
}

export class IAdminBannerDtoFactory {

  private static baseFromEntity(entity: Banner): IAdminBannerDto {
    return {
      id: entity.id,
      title: entity.title,
      titleRo: entity.titleRo || undefined,
      titleRu: entity.titleRu || undefined,
      textRo: entity.titleRo || undefined,
      textRu: entity.textRu || undefined,
      path: entity.path,
      order: entity.order,
      isActive: entity.isActive,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
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