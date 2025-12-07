import { Category, Prisma } from '@prisma/client';
import {
  AdminSubcategoryBriefDtoFactory,
  IAdminSubcategoryBriefDto
} from '@/features/subcategories/dtos/admin-subcategory-brief-dto';

type TCategoryWithRelations = Prisma.CategoryGetPayload<{
  include: {
    subcategories: true,
    _count: { select: { subcategories: true } };
  };
}>;

export interface IAdminCategoryBriefDto {
  id: number;
  nameRo: string;
  nameRu: string;
  descriptionRo?: string;
  descriptionRu?: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  subcategories?: IAdminSubcategoryBriefDto[];
  subcategoriesCount?: number;
}

export class AdminCategoryBriefDtoFactory {
  private static baseFromEntity(entity: Category): Omit<IAdminCategoryBriefDto, 'subcategories'> {
    return {
      id: entity.id,
      nameRo: entity.nameRo,
      descriptionRo: entity.descriptionRo ?? undefined,
      descriptionRu: entity.descriptionRu ?? undefined,
      nameRu: entity.nameRu,
      slug: entity.slug,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString()
    };
  }

  static fromEntity<T extends Category | TCategoryWithRelations>(entity: T): IAdminCategoryBriefDto {
    const dto: IAdminCategoryBriefDto = this.baseFromEntity(entity);

    if ('_count' in entity && entity._count?.subcategories !== undefined) {
      dto.subcategoriesCount = entity._count.subcategories;
    }

    if ('subcategories' in entity && entity.subcategories) {
      dto.subcategories = AdminSubcategoryBriefDtoFactory.fromEntities(entity.subcategories);
    }

    return dto;
  }

  static fromEntities<T extends Category | TCategoryWithRelations>(entities: T[]): IAdminCategoryBriefDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}