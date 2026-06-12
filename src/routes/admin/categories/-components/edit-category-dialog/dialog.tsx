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
import { LoadingButton } from '@/components/ui/loading-button';
import { toast } from 'sonner';

import { ScrollArea } from '@/components/ui/scroll-area';
import { orpc } from '@/lib/orpc';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EditCategoryForm } from './form';
import { editCategorySchema } from '@/features/categories/schemas/edit-category';
import { useEditCategoryDialogContext } from '@/routes/admin/categories/-components/edit-category-dialog/provider';
import { Skeleton } from '@/components/ui/skeleton';
import { z } from 'zod';


export const editCategoryFormSchema = editCategorySchema.omit({ id: true });
export type TEditCategoryFormSchema = z.infer<typeof editCategoryFormSchema>;

export const EditCategoryDialog: FC = () => {
  const { categoryId, setCategoryId } = useEditCategoryDialogContext();
  const queryClient = useQueryClient();

  const form = useForm<TEditCategoryFormSchema>({
    resolver: zodResolver(editCategoryFormSchema),
    defaultValues: {
      nameRo: '',
      nameRu: '',
      slug: '',
      descriptionRo: '',
      descriptionRu: ''
    }
  });

  const { data: category, isFetching } = useQuery({
    ...orpc.admin.categories.getById.queryOptions({ input: { id: categoryId! } }),
    enabled: !!categoryId,
    staleTime: 0
  });

  useEffect(() => {
    if (category) {
      form.reset({
        nameRo: category.nameRo,
        nameRu: category.nameRu,
        descriptionRu: category.descriptionRo,
        descriptionRo: category.descriptionRu,
        slug: category.slug
      });
    }
  }, [category, form]);

  const { mutate, isPending } = useMutation({
    ...orpc.admin.categories.update.mutationOptions(),
    onError: (e) => toast.error('Failed to update', { description: e.message }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orpc.admin.categories.key() });
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
      <AlertDialogContent className="sm:max-w-2xl!">

        <AlertDialogHeader>
          <AlertDialogTitle>Edit Category</AlertDialogTitle>
          <AlertDialogDescription>
            Update the details below and save your changes.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="pr-4 mt-4" type="always">
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
                id="edit-category-form"
                onSubmit={form.handleSubmit((values) => mutate({ ...values, id: categoryId! }))}
              >
                <EditCategoryForm className="max-h-96" disabled={isFetching}/>
              </form>
            </Form>
          )}
        </ScrollArea>

        <AlertDialogFooter className="flex-row mt-6">
          <AlertDialogCancel type="button" className="flex-1 sm:flex-none">
            <IconX/>
            <span>Cancel</span>
          </AlertDialogCancel>

          <LoadingButton
            form="edit-category-form"
            type="submit"
            disabled={isLoading}
            loading={isPending}
            className="flex-1 sm:flex-none"
          >
            <IconSend/>
            <span>Save</span>
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};