import { Banner, Prisma } from '@prisma/client';
import { IAdminBannerImageDto } from '@/features/banners/dtos/admin-banner-image-dto';
import { BannerImageDtoFactory } from '@/features/banners/dtos/banner-image-dto';

type TBannerWithImages = Prisma.BannerGetPayload<{
  include: { desktopImage: true; tabletImage: true; mobileImage: true }
}>

export interface IBannerDto {
  id: number;
  title?: string | null;
  text?: string;
  path?: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  desktopImage?: IAdminBannerImageDto;
  tabletImage?: IAdminBannerImageDto;
  mobileImage?: IAdminBannerImageDto;
}

export class BannerDtoFactory {

  private static baseFromEntity(entity: Banner): IBannerDto {
    return {
      id: entity.id,
      title: entity.titleRo,
      text: entity.titleRo || undefined,
      path: entity.path,
      order: entity.order,
      isActive: entity.isActive,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  static fromEntity<T extends Banner | TBannerWithImages>(entity: T): IBannerDto {
    const dto: IBannerDto = this.baseFromEntity(entity);

    if ('desktopImage' in entity && entity.desktopImage)
      dto.desktopImage = BannerImageDtoFactory.fromEntity(entity.desktopImage);

    if ('tabletImage' in entity && entity.tabletImage)
      dto.tabletImage = BannerImageDtoFactory.fromEntity(entity.tabletImage);

    if ('mobileImage' in entity && entity.mobileImage)
      dto.mobileImage = BannerImageDtoFactory.fromEntity(entity.mobileImage);

    return dto;
  }

  static fromEntities<T extends Banner | TBannerWithImages>(entities: T[]): IBannerDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}