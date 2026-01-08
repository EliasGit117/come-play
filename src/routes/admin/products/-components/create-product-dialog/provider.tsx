import React, { ReactNode, useState } from 'react';
import { contextFactory } from '@/lib/context-factory';

interface ICreateProductDialogProvider {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  open: () => void;
}

const [CreateProductDialogContext, useCreateProductDialogContext] =
  contextFactory<ICreateProductDialogProvider>({
    name: 'CreateProductDialogContext'
  });

export const CreateProductDialogProvider = ({
                                              children
                                            }: {
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);

  return (
    <CreateProductDialogContext.Provider value={{ isOpen, setIsOpen, open }}>
      {children}
    </CreateProductDialogContext.Provider>
  );
};

export { CreateProductDialogContext, useCreateProductDialogContext };