import { base } from '@/features/shared/orpc/base';

export const newsPublicTag = 'News';
export const newsPublicPath = '/news';

export const newsPublicBase = base.route({
  tags: [newsPublicTag],
  path: newsPublicPath,
});
