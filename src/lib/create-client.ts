import { PrismaPg } from '@prisma/adapter-pg';
import { pagination } from 'prisma-extension-pagination';
import { PrismaClient } from '@prisma/client';


export function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

  return new PrismaClient({ adapter })
    .$extends(pagination());
}