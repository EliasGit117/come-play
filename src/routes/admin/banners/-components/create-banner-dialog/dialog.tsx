import { IconSend, IconX } from '@tabler/icons-react';
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
import { BannerForm } from './form';
import { LoadingButton } from '@/components/ui/loading-button';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { createBannerSchema, TCreateBannerSchema } from '@/features/banners/schemas/create-banner';
import { orpc } from '@/lib/orpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCreateBannerDialogContext } from './provider';

interface ICreateBannerDialogProps {
  afterSuccess?: () => void;
}

export const CreateBannerDialog: FC<ICreateBannerDialogProps> = ({ afterSuccess }) => {
  const { isOpen, setIsOpen } = useCreateBannerDialogContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editAfterCreation, setEditAfterCreation] = useState(true);

  const form = useForm<TCreateBannerSchema>({
    resolver: zodResolver(createBannerSchema),
    defaultValues: {
      title: '',
      path: '',
      titleRo: '',
      titleRu: '',
      textRo: '',
      textRu: '',
      isActive: false
    }
  });

  const { mutate, isPending } = useMutation({
    ...orpc.admin.banners.create.mutationOptions(),
    onError: (e) => toast.error(e.name, { description: e.message }),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: orpc.admin.banners.key() });
      setIsOpen(false);
      toast.success('Banner has been successfully created');
      afterSuccess?.();

      if (editAfterCreation)
        void navigate({
          to: '/admin/banners/$id/edit',
          params: { id: `${res.id}` }
        });
    }
  });

  useEffect(() => {
    if (!isOpen) return;
    setEditAfterCreation(true);
    form.reset();
  }, [isOpen]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="sm:max-w-2xl">
        <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => mutate(values))}>
            <AlertDialogHeader>
              <AlertDialogTitle>Create Banner</AlertDialogTitle>
              <AlertDialogDescription>
                Fill out the form below to create a new banner entry.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <ScrollArea className="pr-4 mt-4" type='always'>
              <BannerForm className="max-h-96"/>
            </ScrollArea>

            <div className="flex items-start gap-3 mt-4">
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
                  Redirect to edit banner page to add or change details.
                </p>
              </div>
            </div>

            <AlertDialogFooter className="flex-row mt-6">
              <AlertDialogCancel
                type="button"
                className="flex-1 sm:flex-none"
              >
                <IconX/>
                <span>Cancel</span>
              </AlertDialogCancel>

              <LoadingButton
                type="submit"
                loading={isPending}
                className="flex-1 sm:flex-none"
              >
                <IconSend/>
                <span>Submit</span>
              </LoadingButton>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};