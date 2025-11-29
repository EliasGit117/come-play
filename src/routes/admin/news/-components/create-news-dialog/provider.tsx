import React, { useState, ReactNode } from 'react';
import { contextFactory } from '@/lib/context-factory';

interface ICreateNewsDialogProvider {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  open: () => void;
}

const [CreateNewsDialogContext, useCreateNewsDialogContext] = contextFactory<ICreateNewsDialogProvider>({
  name: 'CreateNewsDialogContext'
});


export const CreateNewsDialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const open = () => setIsOpen(true);

  return (
    <CreateNewsDialogContext.Provider value={{ isOpen: isOpen, setIsOpen: setIsOpen, open: open }}>
      {children}
    </CreateNewsDialogContext.Provider>
  );
};

export {
  CreateNewsDialogContext,
  useCreateNewsDialogContext
};