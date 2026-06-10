import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { AppSidebarProvider } from '@/components/layout';
import { ProgressProvider } from '@bprogress/react';
import { ConfirmDialogProvider } from '@/components/ui/confirm-dialog';
import { RouteProgressController, RouteProgressProvider } from '@/components/layout/route-progress';
import { TooltipProvider } from '@/components/ui/tooltip';


export function Providers({ children }: { children: ReactNode }) {

  return (
    <ProgressProvider options={{ template: null, positionUsing: 'width' }}>
      <RouteProgressProvider>
        <ConfirmDialogProvider>
          <AppSidebarProvider>
            <TooltipProvider>
              <RouteProgressController/>
              {children}
              <Toaster richColors/>
            </TooltipProvider>
          </AppSidebarProvider>
        </ConfirmDialogProvider>
      </RouteProgressProvider>
    </ProgressProvider>
  );
}