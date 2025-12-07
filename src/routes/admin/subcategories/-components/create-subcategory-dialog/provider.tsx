import React, { ReactNode, useState } from 'react';
import { contextFactory } from '@/lib/context-factory';

interface ICreateSubcategoryDialogProvider {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  open: () => void;
}

const [CreateSubcategoryDialogContext, useCreateSubcategoryDialogContext] = contextFactory<ICreateSubcategoryDialogProvider>({
  name: 'CreateSubcategoryDialogContext'
});

export const CreateSubcategoryDialogProvider = ({ children }: { children: ReactNode; }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);

  return (
    <CreateSubcategoryDialogContext.Provider value={{ isOpen, setIsOpen, open }}>
      {children}
    </CreateSubcategoryDialogContext.Provider>
  );
};

export { CreateSubcategoryDialogContext, useCreateSubcategoryDialogContext };