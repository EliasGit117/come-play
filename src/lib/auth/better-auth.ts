import { betterAuth } from 'better-auth';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { admin } from 'better-auth/plugins';
import prisma from '@/lib/prisma';
import { envConfig } from '@/lib/config';
import { serverEnvConfig } from '@/lib/config/server-env-config';
import { accessControl, roles } from './permissions';

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  baseURL: envConfig.appBaseUrl,
  trustedOrigins: [envConfig.appBaseUrl],
  secret: serverEnvConfig.betterAuthSecret,
  emailAndPassword: { enabled: true },
  plugins: [
    tanstackStartCookies(),
    admin({
      defaultRole: 'user',
      ac: accessControl,
      roles: roles,
    }),
  ],
});

export type TUser = typeof auth.$Infer.Session.user;
export type TSession = typeof auth.$Infer.Session.session;
