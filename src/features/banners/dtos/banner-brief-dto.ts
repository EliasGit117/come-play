import { Banner, Prisma } from '@prisma/client';
import { AdminBannerImageDtoFactory } from '@/features/banners/dtos/admin-banner-image-dto';
import { IBannerImageDto } from '@/features/banners/dtos/banner-image-dto';

type TBannerWithImages = Prisma.BannerGetPayload<{
  include: { desktopImage: true; tabletImage: true; mobileImage: true }
}>;

export interface IBannerBriefDto {
  title?: string | null;
  text?: string | null;
  path: string | null;
  desktopImage?: IBannerImageDto;
  tabletImage?: IBannerImageDto;
  mobileImage?: IBannerImageDto;
}

export class BannerBriefDtoFactory {
  private static baseFromEntity(banner: Banner): Omit<IBannerBriefDto, 'desktopImage' | 'tabletImage' | 'mobileImage'> {
    return {
      title: banner.titleRo,
      text: banner.textRo,
      path: banner.path,
    };
  }

  static fromEntity<T extends Banner | TBannerWithImages>(banner: T): IBannerBriefDto {
    const dto: IBannerBriefDto = { ...this.baseFromEntity(banner) };

    if ('desktopImage' in banner && banner.desktopImage)
      dto.desktopImage = AdminBannerImageDtoFactory.fromEntity(banner.desktopImage);

    if ('tabletImage' in banner && banner.tabletImage)
      dto.tabletImage = AdminBannerImageDtoFactory.fromEntity(banner.tabletImage);

    if ('mobileImage' in banner && banner.mobileImage)
      dto.mobileImage = AdminBannerImageDtoFactory.fromEntity(banner.mobileImage);

    return dto;
  }

  static fromEntities<T extends Banner | TBannerWithImages>(banners: T[]): IBannerBriefDto[] {
    return banners.map(banner => this.fromEntity(banner));
  }
}