import React, { createContext, useContext, useState, ReactNode } from "react";

interface ICreateNewsAlertDialogProvider {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CreateNewsAlertDialogContext = createContext<ICreateNewsAlertDialogProvider | undefined>(undefined);

export const CreateNewsAlertDialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <CreateNewsAlertDialogContext.Provider value={{ isOpen: isOpen, setIsOpen: setIsOpen }}>
      {children}
    </CreateNewsAlertDialogContext.Provider>
  );
};

export const useCreateNewsAlertDialog = () => {
  const context = useContext(CreateNewsAlertDialogContext);
  if (!context)
    throw new Error("useCreateNewsAlertDialog must be used within a CreateNewsAlertDialogContext");

  return context;
};
