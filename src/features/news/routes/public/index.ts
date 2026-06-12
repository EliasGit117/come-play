import { getLatestNews } from './get-latest';
import { getNewsBySlug } from './get-by-slug';
import { getNewsPaginated } from './get-paginated';

export const newsPublicRoutes = {
  latest: getLatestNews,
  getBySlug: getNewsBySlug,
  search: getNewsPaginated,
};
