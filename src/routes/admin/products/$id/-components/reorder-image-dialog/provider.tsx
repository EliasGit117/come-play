import React, { ReactNode, useState } from 'react';
import { contextFactory } from '@/lib/context-factory';

interface IReorderProductImagesDialogProvider {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  open: () => void;
}

const [ReorderProductImagesDialogContext, useReorderProductImagesDialogContext] =
  contextFactory<IReorderProductImagesDialogProvider>({
    name: 'ReorderProductImagesDialogContext'
  });

export const ReorderProductImagesDialogProvider = ({ children }: { children: ReactNode; }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);

  return (
    <ReorderProductImagesDialogContext.Provider value={{ isOpen, setIsOpen, open }}>
      {children}
    </ReorderProductImagesDialogContext.Provider>
  );
};

export { ReorderProductImagesDialogContext, useReorderProductImagesDialogContext };