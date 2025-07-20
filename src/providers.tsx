import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { AppSidebarProdivder } from '@/components/layout';


export function Providers({ children }: { children: ReactNode }) {

  return (
    <AppSidebarProdivder>
      {children}
      <Toaster />
    </AppSidebarProdivder>
  );
}