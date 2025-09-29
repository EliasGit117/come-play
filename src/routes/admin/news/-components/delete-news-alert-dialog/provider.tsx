import React, { createContext, useContext, useState, ReactNode } from "react";
import { useDeleteNewsMutation } from '@/features/news/server-functions/admin/delete-news-by-id';
import { toast } from 'sonner';

interface IDeleteNewsAlertDialogProvider {
  id: number | null;
  setId: (id: number | null) => void;
  delete: () => Promise<void>;
  isPending: boolean;
}

const DeleteNewsAlertDialogContext = createContext<IDeleteNewsAlertDialogProvider | undefined>(undefined);

export const DeleteNewsAlertDialogProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState<number | null>(null);

  const { isPending, mutateAsync } = useDeleteNewsMutation({
    onError: (error) => toast.error(error.name, { description: error.message }),
    onSuccess: () => toast.success('Successfully deleted news'),
  });

  const deleteNews = async () => {
    if (id === null) return;
    await mutateAsync({ data: { id } });
    setId(null);
  };

  return (
    <DeleteNewsAlertDialogContext.Provider value={{ id, setId, delete: deleteNews, isPending }}>
      {children}
    </DeleteNewsAlertDialogContext.Provider>
  );
};

export const useDeleteNewsAlertDialog = () => {
  const context = useContext(DeleteNewsAlertDialogContext);
  if (!context)
    throw new Error("useDeleteNewsAlertDialog must be used within a DeleteNewsAlertDialogProvider");

  return context;
};
