import * as React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { useDeleteNewsAlertDialog } from '@/routes/admin/news/-components/delete-news-alert-dialog/provider';

export const DeleteNewsAlertDialog: React.FC = () => {
  const { id, setId, delete: deleteNews, isPending } = useDeleteNewsAlertDialog();

  const handleDelete = async () => {
    try {
      await deleteNews();
      setId(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AlertDialog open={!!id} onOpenChange={val => !val && setId(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete News</AlertDialogTitle>
          <p>Are you sure you want to delete this news? This action cannot be undone.</p>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction variant='destructive' onClick={handleDelete} disabled={isPending}>
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
