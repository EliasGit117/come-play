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
import { SendIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingButton } from '@/components/ui/loading-button';
import { Skeleton } from '@/components/ui/skeleton';
import { useEditSubcategoryDialogContext } from './provider';
import { useQuery } from '@tanstack/react-query';
import {
  getSubcategoryByIdForAdminQueryOptions
} from '@/features/subcategories/server-functions/admin/get-subcategory-by-id';
import { useEditSubcategoryMutation } from '@/features/subcategories/server-functions/admin/edit-subcategory';
import { SubcategoryForm } from '@/routes/admin/subcategories/-components/edit-subcategory-dialog/form';
import { editSubcategorySchema } from '@/features/subcategories/schemas/edit-subcategory';
import { z } from 'zod';


export const editSubcategoryFormSchema = editSubcategorySchema.omit({ id: true });
export type TEditSubcategoryFormSchema = z.infer<typeof editSubcategoryFormSchema>;

export const EditSubcategoryDialog: FC = () => {
  const { subcategoryId, setSubcategoryId } = useEditSubcategoryDialogContext();

  const form = useForm<TEditSubcategoryFormSchema>({
    resolver: zodResolver(editSubcategoryFormSchema),
    defaultValues: {
      nameRo: '',
      nameRu: '',
      descriptionRo: '',
      descriptionRu: '',
      slug: '',
      categoryId: undefined
    }
  });

  const { data: subcategory, isFetching } = useQuery({
    ...getSubcategoryByIdForAdminQueryOptions(subcategoryId!),
    enabled: !!subcategoryId,
    staleTime: 0
  });

  useEffect(() => {
    if (!subcategory)
      return;

    form.reset({ ...subcategory });
  }, [subcategory, form]);

  const { mutate, isPending } = useEditSubcategoryMutation({
    onError: (e) => toast.error('Failed to update', { description: e.message }),
    onSuccess: () => {
      toast.success('Subcategory updated successfully!');
      setSubcategoryId(undefined);
    }
  });

  const isLoading = isFetching || isPending;

  const onOpenChange = (open: boolean) => {
    if (open)
      return;

    setSubcategoryId(undefined);
  };

  return (
    <AlertDialog open={!!subcategoryId} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-2xl">

        <AlertDialogHeader>
          <AlertDialogTitle>Edit Subcategory</AlertDialogTitle>
          <AlertDialogDescription>
            Update the form below to modify the selected subcategory.
          </AlertDialogDescription>
        </AlertDialogHeader>


        <ScrollArea className="mt-4 pr-4" type="always">
          {isFetching ? (
            <div className="max-h-96 grid md:grid-cols-2 gap-7">
              <div className="space-y-2 col-span-full">
                <Skeleton className="h-4 w-12 rounded-sm"/>
                <Skeleton className="h-9 w-full"/>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-12 rounded-sm"/>
                <Skeleton className="h-9 w-full"/>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-12 rounded-sm"/>
                <Skeleton className="h-9 w-full"/>
              </div>

              <div className="space-y-2 col-span-full">
                <Skeleton className="h-4 w-12 rounded-sm"/>
                <Skeleton className="h-9 w-full"/>
              </div>

              <div className="space-y-1">
                <Skeleton className="h-4 w-12 rounded-sm"/>
                <Skeleton className="h-24 w-full"/>
              </div>

              <div className="space-y-1">
                <Skeleton className="h-4 w-12 rounded-sm"/>
                <Skeleton className="h-24 w-full"/>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form
                id="edit-subcategory-form"
                onSubmit={form.handleSubmit((values) => {
                  mutate({ ...values, id: subcategoryId! });
                })}
              >
                <SubcategoryForm/>
              </form>
            </Form>
          )}
        </ScrollArea>

        <AlertDialogFooter className="flex-row mt-6">
          <AlertDialogCancel type="button" className="flex-1 sm:flex-none">
            <XIcon/>
            <span>Cancel</span>
          </AlertDialogCancel>

          <LoadingButton
            form="edit-subcategory-form"
            type="submit"
            disabled={isLoading}
            loading={isPending}
            className="flex-1 sm:flex-none"
          >
            <SendIcon/>
            <span>Save</span>
          </LoadingButton>
        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  )
    ;
};
