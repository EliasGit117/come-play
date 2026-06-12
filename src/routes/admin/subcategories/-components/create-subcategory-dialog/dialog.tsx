import { IconSend, IconX } from '@tabler/icons-react';
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

import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingButton } from '@/components/ui/loading-button';
import {
  createSubcategorySchema,
  TCreateSubcategorySchema
} from '@/features/subcategories/schemas/create-subcategory';
import { SubcategoryForm } from './form';
import {
  useCreateSubcategoryDialogContext
} from '@/routes/admin/subcategories/-components/create-subcategory-dialog/provider';
import { orpc } from '@/lib/orpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';


export const CreateSubcategoryDialog: FC = () => {
  const { isOpen, setIsOpen } = useCreateSubcategoryDialogContext();
  const queryClient = useQueryClient();

  const form = useForm<TCreateSubcategorySchema>({
    resolver: zodResolver(createSubcategorySchema),
    defaultValues: {
      slug: '',
      nameRo: '',
      nameRu: '',
      descriptionRo: '',
      descriptionRu: '',
      categoryId: undefined,
    }
  });

  const { mutate, isPending } = useMutation({
    ...orpc.admin.subcategories.create.mutationOptions(),
    onError: (e) => toast.error('Failed to create', { description: e.message }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orpc.admin.subcategories.key() });
      toast.success('Subcategory created successfully!');
      setIsOpen(false);
    }
  });

  useEffect(() => {
    if (isOpen) form.reset();
  }, [isOpen]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="sm:max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Create Subcategory</AlertDialogTitle>
          <AlertDialogDescription>
            Provide details for a new subcategory.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="mt-4 pr-4 max-h-96">
          <Form {...form}>
            <form id="form" onSubmit={form.handleSubmit((values) => mutate(values))}>
              <SubcategoryForm/>
            </form>
          </Form>
        </ScrollArea>

        <AlertDialogFooter className="mt-6 flex-row">
          <AlertDialogCancel type="button" className="flex-1 sm:flex-none">
            <IconX/>
            <span>Cancel</span>
          </AlertDialogCancel>
          <LoadingButton
            form="form"
            type="submit"
            loading={isPending}
            className="flex-1 sm:flex-none"
          >
            <IconSend/>
            <span>Submit</span>
          </LoadingButton>
        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  );
};