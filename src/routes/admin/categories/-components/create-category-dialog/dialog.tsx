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
import { BannerForm } from './form';
import { LoadingButton } from '@/components/ui/loading-button';
import { toast } from 'sonner';
import { SendIcon, XIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCreateCategoryDialogContext } from './provider';
import { useCreateCategoryMutation } from '@/features/categories/server-functions/admin/create-category';
import { createCategorySchema, TCreateCategorySchema } from '@/features/categories/schemas/create-category';

interface ICreateCategoryDialogProps {
  afterSuccess?: () => void;
}

export const CreateCategoryDialog: FC<ICreateCategoryDialogProps> = ({ afterSuccess }) => {
  const { isOpen, setIsOpen } = useCreateCategoryDialogContext();

  const form = useForm<TCreateCategorySchema>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      nameRo: '',
      nameRu: '',
      slug: ''
    }
  });

  const { mutate, isPending } = useCreateCategoryMutation({
    onError: (e) => toast.error(e.name, { description: e.message }),
    onSuccess: (res) => {
      setIsOpen(false);
      toast.success('Category has been successfully created');
      afterSuccess?.();
    }
  });

  useEffect(() => {
    if (!isOpen)
      return;

    form.reset();
  }, [isOpen]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="sm:max-w-2xl">

        <AlertDialogHeader>
          <AlertDialogTitle>Create category</AlertDialogTitle>
          <AlertDialogDescription>
            Fill out the form below to create a new category entry.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="pr-4 mt-4" type="always">
          <Form {...form}>
            <form
              id='create-category-form'
              onSubmit={form.handleSubmit((values) => {
                mutate(values)
              })}
            >
              <BannerForm className="max-h-96"/>
            </form>
          </Form>
        </ScrollArea>

        <AlertDialogFooter className="flex-row mt-6">
          <AlertDialogCancel
            type="button"
            className="flex-1 sm:flex-none"
          >
            <XIcon/>
            <span>Cancel</span>
          </AlertDialogCancel>

          <LoadingButton
            form='create-category-form'
            type="submit"
            loading={isPending}
            className="flex-1 sm:flex-none"
          >
            <SendIcon/>
            <span>Submit</span>
          </LoadingButton>
        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  );
};