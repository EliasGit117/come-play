import { ORPCError } from '@orpc/server';
import { base } from '@/features/shared/orpc/base';
import { auth } from './better-auth';

export const authMiddleware = base.middleware(async ({ context, next }) => {
  const sessionData = await auth.api.getSession({ headers: context.headers });

  if (!context.headers)
    console.error('Missing headers in auth middleware', context);

  if (!sessionData?.session || !sessionData?.user)
    throw new ORPCError('UNAUTHORIZED', { message: 'Unauthorized' });

  return next({
    context: { session: sessionData.session, user: sessionData.user },
  });
});
