import type { InferRouterInputs, InferRouterOutputs } from '@orpc/server';
import { base } from './base';
import { sessionsPublicRoutes } from '@/features/sessions/routes/public';
import { newsAdminRoutes } from '@/features/news/routes/admin';
import { newsPublicRoutes } from '@/features/news/routes/public';
import { bannersAdminRoutes } from '@/features/banners/routes/admin';
import { customerRequestsAdminRoutes } from '@/features/customer-requests/routes/admin';
import { customerRequestsPublicRoutes } from '@/features/customer-requests/routes/public';
import { bannersPublicRoutes } from '@/features/banners/routes/public';
import { dashboardAdminRoutes } from '@/features/dashboard/routes/admin';

export const orpcRouter = base.router({
  sessions: sessionsPublicRoutes,
  news: newsPublicRoutes,
  banners: bannersPublicRoutes,
  customerRequests: customerRequestsPublicRoutes,
  admin: {
    news: newsAdminRoutes,
    banners: bannersAdminRoutes,
    customerRequests: customerRequestsAdminRoutes,
    dashboard: dashboardAdminRoutes,
  },
});

export type TOrpcRouter = typeof orpcRouter;
export type TOrpcInputs = InferRouterInputs<TOrpcRouter>;
export type TOrpcOutputs = InferRouterOutputs<TOrpcRouter>;
