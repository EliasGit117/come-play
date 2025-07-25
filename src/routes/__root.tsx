/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { DefaultCatchBoundary } from '@/components/default-catch-boundary';
import { NotFound } from '@/components/not-found';
import appCss from '@/styles/app.css?url';
import { seo } from '@/utils/seo';
import { Providers } from '@/providers';
import { AppFooter, AppHeader, AppSidebar } from '@/components/layout';

interface IRootRouteProps {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<IRootRouteProps>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ...seo({
        title:
          'TanStack Start | Type-Safe, Client-First, Full-Stack React Framework',
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `
      })
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' }
    ]
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound/>,
  component: RootComponent
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet/>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
    <head>
      <HeadContent/>
    </head>

    <body className='flex flex-col min-h-svh'>
    <Providers>
      <AppHeader/>
      <AppSidebar/>
      {children}
      <AppFooter className='mt-auto'/>
    </Providers>
    {/*<TanStackRouterDevtools position="bottom-right" />*/}
    {/*<ReactQueryDevtools buttonPosition="bottom-left" />*/}
    <Scripts/>
    </body>
    </html>
  );
}

