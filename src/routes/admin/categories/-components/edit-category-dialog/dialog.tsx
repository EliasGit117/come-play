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
import { LoadingButton } from '@/components/ui/loading-button';
import { toast } from 'sonner';
import { SendIcon, XIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCategoryByIdForAdminQueryOptions } from '@/features/categories/server-functions/admin/get-category-by-id-for-admin';
import { useQuery } from '@tanstack/react-query';
import { EditCategoryForm } from './form';
import { editCategorySchema, TEditCategorySchema } from '@/features/categories/schemas/edit-category';
import { useEditCategoryDialogContext } from '@/routes/admin/categories/-components/edit-category-dialog/provider';
import { useEditCategoryMutation } from '@/features/categories/server-functions/admin/edit-category';
import { Skeleton } from '@/components/ui/skeleton';

export const EditCategoryDialog: FC = () => {
  const { categoryId, setCategoryId } = useEditCategoryDialogContext();

  const form = useForm<TEditCategorySchema>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: { nameRo: '', nameRu: '', slug: '' }
  });

  const { data: category, isFetching } = useQuery({
    ...getCategoryByIdForAdminQueryOptions(categoryId!),
    enabled: !!categoryId,
    staleTime: 0
  });

  useEffect(() => {
    if (category) {
      form.reset({
        nameRo: category.nameRo,
        nameRu: category.nameRu,
        slug: category.slug
      });
    }
  }, [category, form]);

  const { mutate, isPending } = useEditCategoryMutation({
    onError: (e) => toast.error('Failed to update', { description: e.message }),
    onSuccess: () => {
      toast.success('Category updated successfully!');
      setCategoryId(undefined);
    }
  });

  const onOpenChange = (v: boolean) => {
    if (v)
      return;

    setCategoryId(undefined);
  };

  const isLoading = isFetching || isPending;

  return (
    <AlertDialog open={!!categoryId} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => mutate({ ...values, id: categoryId! }))}>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Category</AlertDialogTitle>
              <AlertDialogDescription>
                Update the details below and save your changes.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <ScrollArea className="pr-4 mt-4" type="always">
              {isFetching ? (
                <div className="max-h-96 grid md:grid-cols-2 gap-7">
                  <div className='space-y-2 col-span-full'>
                    <Skeleton className='h-4 w-12 rounded-sm'/>
                    <Skeleton className='h-9 w-full'/>
                  </div>

                  <div className='space-y-1'>
                    <Skeleton className='h-4 w-12 rounded-sm'/>
                    <Skeleton className='h-9 w-full'/>
                  </div>

                  <div className='space-y-1'>
                    <Skeleton className='h-4 w-12 rounded-sm'/>
                    <Skeleton className='h-9 w-full'/>
                  </div>
                </div>
              ) : (
                <EditCategoryForm className="max-h-96" disabled={isFetching}/>
              )}
            </ScrollArea>

            <AlertDialogFooter className="flex-row mt-6">
              <AlertDialogCancel type="button" className="flex-1 sm:flex-none">
                <XIcon/>
                <span>Cancel</span>
              </AlertDialogCancel>

              <LoadingButton
                type="submit"
                disabled={isLoading}
                loading={isPending}
                className="flex-1 sm:flex-none"
              >
                <SendIcon/>
                <span>Save</span>
              </LoadingButton>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};