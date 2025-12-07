import React, { ReactNode, useState } from 'react';
import { contextFactory } from '@/lib/context-factory';

interface IEditSubcategoryDialogProvider {
  subcategoryId?: number;
  setSubcategoryId: (value?: number) => void;
}

const [EditSubcategoryDialogContext, useEditSubcategoryDialogContext] =
  contextFactory<IEditSubcategoryDialogProvider>({
    name: 'EditSubcategoryDialogContext',
  });

export const EditSubcategoryDialogProvider = ({
                                                children,
                                              }: {
  children: ReactNode;
}) => {
  const [subcategoryId, setSubcategoryId] = useState<number | undefined>();

  return (
    <EditSubcategoryDialogContext.Provider
      value={{ subcategoryId, setSubcategoryId }}
    >
      {children}
    </EditSubcategoryDialogContext.Provider>
  );
};

export { EditSubcategoryDialogContext, useEditSubcategoryDialogContext };