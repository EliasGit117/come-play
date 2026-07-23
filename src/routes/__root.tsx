/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import { HeadContent, Outlet, Scripts, createRootRouteWithContext, useRouter } from '@tanstack/react-router';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { DefaultCatchBoundary } from '@/components/default-catch-boundary';
import appCss from '@/styles/app.css?url';
import { seo, SITE_NAME } from '@/utils/seo';
import { m } from '@/paraglide/messages';
import { Providers } from '@/providers';
import { ThemeProvider } from '@/components/theme';
import { FC, ReactNode, useEffect, useRef } from 'react';
import { orpc } from '@/lib/orpc';
import type { TSession, TUser } from '@/lib/auth/server';

interface IRootRouteProps {
  queryClient: QueryClient;
  session?: TSession | null;
  user?: TUser | null;
}

export const Route = createRootRouteWithContext<IRootRouteProps>()({
  beforeLoad: async ({ context: { queryClient } }) => {
    const res = await queryClient.ensureQueryData(orpc.sessions.current.queryOptions());
    return { session: res?.session, user: res?.user };
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ...seo({
        title: `${SITE_NAME} | ${m['common.seo.title']()}`,
        description: m['common.seo.description']()
      })
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
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
        <RouterInvalidation/>
      </Providers>
      <Scripts/>
    </ThemeProvider>
    </body>
    </html>
  );
}


// Invalidates route if session change
const RouterInvalidation: FC = () => {
  const router = useRouter();
  const { data: authRes } = useQuery({
    ...orpc.sessions.current.queryOptions(),
    retry: false
  });
  const prevSession = useRef<TSession | null>(authRes?.session);

  useEffect(() => {
    if (authRes?.session === prevSession.current)
      return;

    prevSession.current = authRes?.session;
    router.invalidate();
  }, [authRes]);

  return null;
};
