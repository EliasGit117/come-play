import { createAuthClient } from 'better-auth/react';
import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins';
import { envConfig } from '@/lib/config';
import { accessControl, roles } from './permissions';
import type { auth } from './better-auth';

export const authClient = createAuthClient({
  baseURL: envConfig.betterAuthBaseUrl,
  fetchOptions: {
    onError: (error) => {
      console.error('Auth client error:', error);
    },
  },
  plugins: [
    adminClient({ ac: accessControl, roles: roles }),
    inferAdditionalFields<typeof auth>(),
  ],
});
