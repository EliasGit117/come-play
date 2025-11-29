import { ReactNode, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { AppSidebarProvider } from '@/components/layout';
import { ProgressProvider } from '@bprogress/react';
import { useRouter } from '@tanstack/react-router';
import { BProgress } from '@bprogress/core';
import { ConfirmDialogProvider } from '@/components/ui/confirm-dialog';


export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const unsubOnBeforeLoad = router.subscribe('onBeforeLoad', ({ fromLocation, pathChanged }) => {
      fromLocation && pathChanged && BProgress.start();
    });

    const unsubOnLoad = router.subscribe('onLoad', () => BProgress.done());

    return () => {
      unsubOnBeforeLoad();
      unsubOnLoad();
    };
  }, [router]);

  return (
    <ProgressProvider options={{ template: null, positionUsing: 'width' }}>
      <ConfirmDialogProvider>
        <AppSidebarProvider>
          {children}
          <Toaster/>
        </AppSidebarProvider>
      </ConfirmDialogProvider>
    </ProgressProvider>
  );
}