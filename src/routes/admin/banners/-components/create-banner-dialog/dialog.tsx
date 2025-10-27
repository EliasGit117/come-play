import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Form } from '@/components/ui/form';
import { LoadingButton } from '@/components/ui/loading-button';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import './form';
import { BannerForm } from '@/routes/admin/banners/-components/create-banner-dialog/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendIcon, XIcon } from 'lucide-react';
import { createBannerSchema, TCreateBannerSchema } from '@/features/banners/schemas/create-banner';
import { useCreateBannerMutation } from '@/features/banners/server-functions/admin/create-banner';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';


interface CreateNewsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  afterSuccess?: () => void;
}

const CreateBannerDialog: FC<CreateNewsDialogProps> = ({ open, setOpen, afterSuccess }) => {
  const navigate = useNavigate();
  const [editAfterCreation, setEditAfterCreation] = useState(true);
  const form = useForm<TCreateBannerSchema>({
    resolver: zodResolver(createBannerSchema),
    defaultValues: {
      path: '',
      titleRo: '',
      titleRu: '',
      textRo: '',
      textRu: ''
    }
  });

  const { mutate, isPending } = useCreateBannerMutation({
    onError: (e) => toast.error(e.name, { description: e.message }),
    onSuccess: (res, data) => {
      setOpen(false);
      toast.success('Banner has been successfully created');
      afterSuccess?.();

      if (editAfterCreation)
        void navigate({ to: '/admin/banners/$id/edit', params: { id: `${res.id}` } });
    }
  });


  useEffect(() => {
    if (!open)
      return;

    setEditAfterCreation(true);
    form.reset();
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="sm:max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values: TCreateBannerSchema) => mutate(values))}>
            <AlertDialogHeader>
              <AlertDialogTitle>Create Banner</AlertDialogTitle>
              <AlertDialogDescription>
                Fill out the form below to create a new banner entry.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <ScrollArea type="always" className="mt-4 pr-4">
              <BannerForm className="max-h-96"/>
            </ScrollArea>

            <div className="flex items-start gap-3 mt-8">
              <Checkbox
                id="edit-after-creation-checkbox"
                checked={editAfterCreation}
                onCheckedChange={(v) => setEditAfterCreation(!!v)}
                disabled={isPending}
              />
              <div className="grid gap-2">
                <Label htmlFor="edit-after-creation-checkbox">
                  Edit after creation
                </Label>
                <p className="text-muted-foreground text-sm">
                  Redirect to edit banner page to add new data or change existing ones
                </p>
              </div>
            </div>

            <AlertDialogFooter className="flex-row mt-6">
              <AlertDialogCancel type="button" className='flex-1 sm:flex-none'>
                <XIcon/>
                <span>Cancel</span>
              </AlertDialogCancel>

              <LoadingButton type="submit" loading={isPending} className='flex-1 sm:flex-none'>
                <SendIcon/>
                <span>Submit</span>
              </LoadingButton>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateBannerDialog;