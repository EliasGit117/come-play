import { Banner, Prisma } from '@prisma/client';
import { AdminBannerImageDtoFactory, IAdminBannerImageDto } from '@/features/banners/dtos/admin-banner-image-dto';

type TBannerWithImages = Prisma.BannerGetPayload<{
  include: { desktopImage: true; tabletImage: true; mobileImage: true }
}>;

export interface IAdminBannerBriefDto {
  id: number;
  title: string;
  titleRo?: string;
  titleRu?: string;
  path: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  desktopImage?: IAdminBannerImageDto;
  tabletImage?: IAdminBannerImageDto;
  mobileImage?: IAdminBannerImageDto;
}

export class AdminBannerBriefDtoFactory {
  private static baseFromEntity(banner: Banner): Omit<IAdminBannerBriefDto, 'desktopImage' | 'tabletImage' | 'mobileImage'> {
    return {
      id: banner.id,
      title: banner.title,
      titleRo: banner.titleRo || undefined,
      titleRu: banner.titleRu || undefined,
      path: banner.path,
      order: banner.order,
      isActive: banner.isActive,
      createdAt: banner.createdAt.toISOString(),
      updatedAt: banner.updatedAt.toISOString(),
    };
  }

  static fromEntity<T extends Banner | TBannerWithImages>(banner: T): IAdminBannerBriefDto {
    const dto: IAdminBannerBriefDto = { ...this.baseFromEntity(banner) };

    if ('desktopImage' in banner && banner.desktopImage)
      dto.desktopImage = AdminBannerImageDtoFactory.fromEntity(banner.desktopImage);

    if ('tabletImage' in banner && banner.tabletImage)
      dto.tabletImage = AdminBannerImageDtoFactory.fromEntity(banner.tabletImage);

    if ('mobileImage' in banner && banner.mobileImage)
      dto.mobileImage = AdminBannerImageDtoFactory.fromEntity(banner.mobileImage);

    return dto;
  }

  static fromEntities<T extends Banner | TBannerWithImages>(banners: T[]): IAdminBannerBriefDto[] {
    return banners.map(banner => this.fromEntity(banner));
  }
}