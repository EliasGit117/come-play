import { m } from '@/paraglide/messages';

type MessageFn = () => string;

export const tm = (key: string): string => {
  const fn = (m as unknown as Record<string, MessageFn>)[key];
  return fn ? fn() : '';
};
