import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { AppSidebarProvider } from '@/components/layout';


export function Providers({ children }: { children: ReactNode }) {

  return (
    <AppSidebarProvider>
      {children}
      <Toaster />
    </AppSidebarProvider>
  );
}