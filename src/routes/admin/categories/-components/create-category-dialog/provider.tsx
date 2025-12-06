import React, { ReactNode, useState } from 'react';
import { contextFactory } from '@/lib/context-factory';

interface ICreateCategoryDialogProvider {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  open: () => void;
}

const [CreateCategoryDialogContext, useCreateCategoryDialogContext] = contextFactory<ICreateCategoryDialogProvider>({
  name: 'CreateCategoryDialogContext'
});

export const CreateCategoryDialogProvider = ({ children }: { children: ReactNode; }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);

  return (
    <CreateCategoryDialogContext.Provider value={{ isOpen, setIsOpen, open }}>
      {children}
    </CreateCategoryDialogContext.Provider>
  );
};

export { CreateCategoryDialogContext, useCreateCategoryDialogContext };