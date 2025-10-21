'use client';

import { FC, useEffect } from 'react';
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
import { NewsForm } from './form';
import { LoadingButton } from '@/components/ui/loading-button';
import {
  createNewsSchema,
  TCreatNewsSchema,
  useCreateNewsMutation
} from '@/features/news/server-functions/admin/create-news';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { SendIcon, XIcon } from 'lucide-react';


interface CreateNewsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  afterSuccess?: () => void;
}

export const CreateNewsDialog: FC<CreateNewsDialogProps> = ({ open, setOpen, afterSuccess }) => {
  const navigate = useNavigate();
  const form = useForm<TCreatNewsSchema>({
    resolver: zodResolver(createNewsSchema),
    defaultValues: {
      slug: '',
      titleRo: '',
      titleRu: '',
      editAfterCreation: true
    }
  });

  const { mutate, isPending } = useCreateNewsMutation({
    onError: (e) => toast.error(e.name, { description: e.message }),
    onSuccess: (res, data) => {
      setOpen(false);
      toast.success('News has been successfully created');
      afterSuccess?.();

      if (data.editAfterCreation)
        void navigate({ to: '/admin/news/$id/edit', params: { id: `${res.id}` } });
    }
  });

  useEffect(() => {
    if (!open)
      return;

    form.reset();
  }, [open]);


  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values: TCreatNewsSchema) => mutate(values))}>
            <AlertDialogHeader>
              <AlertDialogTitle>Create News</AlertDialogTitle>
              <AlertDialogDescription>
                Fill out the form below to create a new news entry.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="mt-4">
              <NewsForm/>
            </div>

            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel type="button">
                <XIcon/>
                <span>Cancel</span>
              </AlertDialogCancel>

              <LoadingButton type="submit" loading={isPending}>
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
