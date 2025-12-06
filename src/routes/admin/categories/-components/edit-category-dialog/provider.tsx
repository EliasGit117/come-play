import React, { ReactNode, useState } from 'react';
import { contextFactory } from '@/lib/context-factory';

interface IEditCategoryDialogProvider {
  categoryId?: number;
  setCategoryId: (value?: number) => void;
}

const [EditCategoryDialogContext, useEditCategoryDialogContext] = contextFactory<IEditCategoryDialogProvider>({
  name: 'EditCategoryDialogContext'
});

export const EditCategoryDialogProvider = ({ children }: { children: ReactNode; }) => {
  const [categoryId, setCategoryId] = useState<number | undefined>();

  return (
    <EditCategoryDialogContext.Provider value={{ categoryId, setCategoryId }}>
      {children}
    </EditCategoryDialogContext.Provider>
  );
};

export { EditCategoryDialogContext, useEditCategoryDialogContext };