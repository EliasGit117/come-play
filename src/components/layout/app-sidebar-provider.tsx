import { createContext, useContext, useState } from 'react';
import { createStore, StoreApi } from 'zustand/vanilla';
import { useStore } from 'zustand/react';

interface IAppSidebarStore {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const AppSidebarContext =
  createContext<StoreApi<IAppSidebarStore> | null>(null);


export const AppSidebarProdivder = ({ children }: { children: React.ReactNode }) => {
  const [store] = useState(() =>
    createStore<IAppSidebarStore>((set) => ({
      isOpen: false,
      setOpen: (open) => set(() => ({ isOpen: open })),
    }))
  );


  return (
    <AppSidebarContext.Provider value={store}>
      {children}
    </AppSidebarContext.Provider>
  );
};


export const useAppSidebar = <T, >(selector: (state: IAppSidebarStore) => T) => {
  const store = useContext(AppSidebarContext);
  if (!store)
    throw new Error('Missing AppSidebarProvider');

  return useStore(store, selector);
};
