import { createPrismaClient } from '@/lib/create-client';


export type TPrismaExtendedClient = ReturnType<typeof createPrismaClient>;
export type TxClient = Omit<TPrismaExtendedClient, '$connect' | '$disconnect' | '$transaction' | '$extends'>;

declare global {
  var __prisma: TPrismaExtendedClient | undefined;
}

const prisma =
  globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export default prisma;