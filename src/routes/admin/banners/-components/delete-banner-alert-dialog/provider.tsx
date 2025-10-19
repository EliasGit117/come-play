// routes/admin/banners/-components/delete-banner-alert-dialog/provider.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useDeleteBannerMutation } from '@/features/banners/server-functions/admin/delete-banner-by-id';
import { toast } from 'sonner';

interface IDeleteBannerAlertDialogProvider {
  id: number | null;
  setId: (id: number | null) => void;
  delete: () => Promise<void>;
  isPending: boolean;
}

const DeleteBannerAlertDialogContext = createContext<
  IDeleteBannerAlertDialogProvider | undefined
>(undefined);

export const DeleteBannerAlertDialogProvider = ({
                                                  children
                                                }: {
  children: ReactNode;
}) => {
  const [id, setId] = useState<number | null>(null);

  const { isPending, mutateAsync } = useDeleteBannerMutation({
    onError: (error) => toast.error(error.name, { description: error.message }),
    onSuccess: () => toast.success('Successfully deleted banner')
  });

  const deleteBanner = async () => {
    if (id === null) return;
    await mutateAsync({ data: { id } });
    setId(null);
  };

  return (
    <DeleteBannerAlertDialogContext.Provider
      value={{ id, setId, delete: deleteBanner, isPending }}
    >
      {children}
    </DeleteBannerAlertDialogContext.Provider>
  );
};

export const useDeleteBannerAlertDialog = () => {
  const context = useContext(DeleteBannerAlertDialogContext);
  if (!context)
    throw new Error(
      'useDeleteBannerAlertDialog must be used within a DeleteBannerAlertDialogProvider'
    );

  return context;
};