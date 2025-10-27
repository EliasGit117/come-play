import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ICreateBannerDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CreateBannerDialogContext = createContext<ICreateBannerDialogProps | undefined>(undefined);

export const CreateBannerDialogProvider = ({ children }: { children: ReactNode; }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);


  return (
    <CreateBannerDialogContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </CreateBannerDialogContext.Provider>
  );
};

export const useCreateBannerDialog = () => {
  const context = useContext(CreateBannerDialogContext);
  if (!context)
    throw new Error(
      'useCreateBannerDialog must be used within a CreateBannerDialogProvider'
    );

  return context;
};