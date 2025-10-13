/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import { HeadContent, Outlet, Scripts, createRootRouteWithContext, useRouterState } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { DefaultCatchBoundary } from '@/components/default-catch-boundary';
import appCss from '@/styles/app.css?url';
import { seo } from '@/utils/seo';
import { Providers } from '@/providers';
import { ThemeProvider } from '@/components/theme';
import { useMountedEffect } from '@/hooks/use-mounted-effect';
import { ReactNode } from 'react';

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
  component: RootComponent
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet/>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {

  return (
    <html suppressHydrationWarning>
      <head>
        <meta name="viewport" content="initial-scale=1, viewport-fit=cover, width=device-width"/>
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="oklch(1 0 0)"/>
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="oklch(0.145 0 0)"/>

        <HeadContent/>
      </head>

      <body className="flex flex-col min-h-svh">
      <ThemeProvider defaultTheme="system">
        <Providers>
          {children}
        </Providers>
        {/*<TanStackRouterDevtools position="bottom-right" />*/}
        {/*<ReactQueryDevtools buttonPosition="bottom-left" />*/}
        <ScrollRestorationScript/>
        <Scripts/>
      </ThemeProvider>
      </body>
    </html>
  );
}

// TODO: A workaround to move page to top on navigation change
const ScrollRestorationScript = () => {
  const pathname = useRouterState({ select: state => state.location.pathname })

  useMountedEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return null;
}