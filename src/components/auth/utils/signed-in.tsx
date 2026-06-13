import type { PropsWithChildren } from 'react';
import { useAuth } from '@/hooks/use-auth';

export const SignedIn = ({ children }: PropsWithChildren) => {
  const { session } = useAuth();
  return session ? children : null;
};
