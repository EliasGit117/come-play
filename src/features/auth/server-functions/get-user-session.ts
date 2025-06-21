import { createMiddleware, createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/start-server-core';
import { auth } from '@/lib/auth';
import { queryOptions } from '@tanstack/react-query';

export const getUserSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getWebRequest();
    if (!request?.headers)
      return null;


    const userSession = await auth.api.getSession({ headers: request.headers });

    return userSession;
  }
)