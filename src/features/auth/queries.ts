import { queryOptions } from '@tanstack/react-query';
import { getUserSession } from '@/features/auth/server-functions/get-user-session';


export const authQueries = {
  getUser: () =>
    queryOptions({
      queryKey: [authQueryKeys.getUser],
      queryFn: () => getUserSession(),
      staleTime: 5000,
    }),
}

const baseKey = 'auth';
export const authQueryKeys = {
  getUser: [baseKey, 'user']
}