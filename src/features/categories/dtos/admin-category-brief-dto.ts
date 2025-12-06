import { Category, Prisma } from '@prisma/client';
import {
  AdminSubcategoryBriefDtoFactory,
  IAdminSubcategoryBriefDto
} from '@/features/subcategories/dtos/admin-subcategory-brief-dto';

type TCategoryWithRelations = Prisma.CategoryGetPayload<{
  include: { subcategories: true };
}>;

export interface IAdminCategoryBriefDto {
  id: number;
  nameRo: string;
  nameRu: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  subcategories?: IAdminSubcategoryBriefDto[];
}

export class AdminCategoryBriefDtoFactory {
  private static baseFromEntity(entity: Category): Omit<IAdminCategoryBriefDto, 'subcategories'> {
    return {
      id: entity.id,
      nameRo: entity.nameRo,
      nameRu: entity.nameRu,
      slug: entity.slug,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  static fromEntity<T extends Category | TCategoryWithRelations>(entity: T): IAdminCategoryBriefDto {
    const dto: IAdminCategoryBriefDto = this.baseFromEntity(entity);

    if ('subcategories' in entity && entity.subcategories) {
      dto.subcategories = AdminSubcategoryBriefDtoFactory.fromEntities(entity.subcategories);
    }

    return dto;
  }

  static fromEntities<T extends Category | TCategoryWithRelations>(entities: T[]): IAdminCategoryBriefDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}