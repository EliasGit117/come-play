import type { InferRouterInputs, InferRouterOutputs } from '@orpc/server';
import { base } from './base';
import { sessionsPublicRoutes } from '@/features/sessions/routes/public';
import { categoriesAdminRoutes } from '@/features/categories/routes/admin';
import { subcategoriesAdminRoutes } from '@/features/subcategories/routes/admin';
import { newsAdminRoutes } from '@/features/news/routes/admin';
import { newsPublicRoutes } from '@/features/news/routes/public';
import { productsAdminRoutes } from '@/features/products/routes/admin';
import { bannersAdminRoutes } from '@/features/banners/routes/admin';
import { bannersPublicRoutes } from '@/features/banners/routes/public';

export const orpcRouter = base.router({
  sessions: sessionsPublicRoutes,
  news: newsPublicRoutes,
  banners: bannersPublicRoutes,
  admin: {
    categories: categoriesAdminRoutes,
    subcategories: subcategoriesAdminRoutes,
    news: newsAdminRoutes,
    products: productsAdminRoutes,
    banners: bannersAdminRoutes,
  },
});

export type TOrpcRouter = typeof orpcRouter;
export type TOrpcInputs = InferRouterInputs<TOrpcRouter>;
export type TOrpcOutputs = InferRouterOutputs<TOrpcRouter>;
