import { QueryClient } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';
import { DefaultCatchBoundary } from './components/default-catch-boundary';
import { NotFoundCard } from './components/not-found-card';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { createRouter } from '@tanstack/react-router';


export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false
      }
    }
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => {
      return (
        <main className="container mx-auto p-4">
          <NotFoundCard className="mx-auto"/>
        </main>
      );
    },
    scrollRestoration: true

  });
  setupRouterSsrQueryIntegration({
    router,
    queryClient
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }


  interface StaticDataRouteOption {
    headerOptions?: {
      type?: 'fixed' | 'sticky';
    };
  }
}
