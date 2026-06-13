import { CustomerRequest, EmailNotificationStatus } from '@prisma/client';

export interface IAdminCustomerRequestDto {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string | null;
  emailNotificationStatus: EmailNotificationStatus;
  createdAt: string;
  updatedAt: string;
}

export class AdminCustomerRequestDtoFactory {
  static fromEntity(entity: CustomerRequest): IAdminCustomerRequestDto {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      phone: entity.phone,
      email: entity.email,
      message: entity.message,
      emailNotificationStatus: entity.emailNotificationStatus,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  static fromEntities(entities: CustomerRequest[]): IAdminCustomerRequestDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
