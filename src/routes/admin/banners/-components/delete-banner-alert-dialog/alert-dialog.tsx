import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter
} from '@/components/ui/alert-dialog';
import { useDeleteBannerAlertDialog } from '@/routes/admin/banners/-components/delete-banner-alert-dialog/provider';

export const DeleteBannerAlertDialog: React.FC = () => {
  const { id, setId, delete: deleteBanner, isPending } =
    useDeleteBannerAlertDialog();

  const handleDelete = async () => {
    try {
      await deleteBanner();
      setId(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AlertDialog open={!!id} onOpenChange={(val) => !val && setId(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Banner</AlertDialogTitle>
          <p>
            Are you sure you want to delete this banner? This action cannot be
            undone.
          </p>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};