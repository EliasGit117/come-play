import React, { ReactNode, useState } from 'react';
import { contextFactory } from '@/lib/context-factory';

interface IReorderBannersDialogProvider {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  open: () => void;
}

const [ReorderBannersDialogContext, useReorderBannersDialogContext] = contextFactory<IReorderBannersDialogProvider>({
  name: 'ReorderBannersDialogContext'
});

export const ReorderBannersDialogProvider = ({ children }: { children: ReactNode; }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);

  return (
    <ReorderBannersDialogContext.Provider value={{ isOpen, setIsOpen, open }}>
      {children}
    </ReorderBannersDialogContext.Provider>
  );
};

export { ReorderBannersDialogContext, useReorderBannersDialogContext };