"use client";

import { FC, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Form } from "@/components/ui/form";
import { TCreateNewsFormSchema, createNewsFormSchema, NewsForm } from './create-news-form';
import { LoadingButton } from '@/components/ui/loading-button';
import { useCreateNewsMutation } from '@/features/news/server-functions/create-news';
import { toast } from 'sonner';



interface CreateNewsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  afterSuccess?: () => void;
}

export const CreateNewsDialog: FC<CreateNewsDialogProps> = ({ open, setOpen, afterSuccess }) => {
  const form = useForm<TCreateNewsFormSchema>({
    resolver: zodResolver(createNewsFormSchema),
    defaultValues: {
      slug: "",
      titleRo: "",
      titleRu: "",
      editAfterCreation: true
    },
  });

  const { mutate, isPending } = useCreateNewsMutation({
    onError: (e) => toast.error(e.name, { description: e.message }),
    onSuccess: () => {
      setOpen(false);
      toast.success('News has been successfully created')
      afterSuccess?.();
    },
  });


  const onSubmit = (values: TCreateNewsFormSchema)=> mutate(values);
  const handleSubmit = () => form.handleSubmit(onSubmit)();

  useEffect(() => {
    if (!open)
      return;

    form.reset();
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-2xl">
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <AlertDialogHeader>
              <AlertDialogTitle>Create News</AlertDialogTitle>
              <AlertDialogDescription>
                Fill out the form below to create a new news entry.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="mt-4">
              <NewsForm />
            </div>

            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel type="button">
                Cancel
              </AlertDialogCancel>

              <LoadingButton type='button' loading={isPending} onClick={handleSubmit}>
                Submit
              </LoadingButton>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
