import React, { ReactNode, useState } from 'react';
import { contextFactory } from '@/lib/context-factory';

interface ICreateBannerDialogProvider {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  open: () => void;
}

const [CreateBannerDialogContext, useCreateBannerDialogContext] =
  contextFactory<ICreateBannerDialogProvider>({
    name: 'CreateBannerDialogContext'
  });

export const CreateBannerDialogProvider = ({ children }: { children: ReactNode; }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);

  return (
    <CreateBannerDialogContext.Provider value={{ isOpen, setIsOpen, open }}>
      {children}
    </CreateBannerDialogContext.Provider>
  );
};

export { CreateBannerDialogContext, useCreateBannerDialogContext };