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
import { ProductForm } from './form';
import { LoadingButton } from '@/components/ui/loading-button';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  createProductSchema,
  TCreateProductSchema
} from '@/features/products/schemas/create-product';
import { useCreateProductMutation } from '@/features/products/server-functions/admin/create-product';
import { useCreateProductDialogContext } from './provider';


interface ICreateProductDialogProps {
  afterSuccess?: () => void;
}

export const CreateProductDialog: FC<ICreateProductDialogProps> = ({ afterSuccess }) => {
  const { isOpen, setIsOpen } = useCreateProductDialogContext();
  const navigate = useNavigate();
  const [editAfterCreation, setEditAfterCreation] = useState(true);

  const form = useForm<TCreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      nameRo: '',
      nameRu: '',
      slug: '',
      hidden: true,
      price: undefined,
      oldPrice: undefined,
      subcategoryId: undefined,
      sticker: undefined,
      state: 'not_available',
      shortDescriptionRu: '',
      shortDescriptionRo: '',
    }
  });

  const { mutate, isPending } = useCreateProductMutation({
    onError: (e) => toast.error(e.name, { description: e.message }),
    onSuccess: (res) => {
      setIsOpen(false);
      toast.success('Product has been successfully created');
      afterSuccess?.();

      if (editAfterCreation) {
        void navigate({ to: '/admin/products/$id/edit', params: { id: `${res.id}` } });
      }
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => mutate(values))}>
            <AlertDialogHeader>
              <AlertDialogTitle>Create Product</AlertDialogTitle>
              <AlertDialogDescription>
                Fill out the form below to create a new product.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <ScrollArea className="pr-4 mt-4" type="always">
              <ProductForm className="max-h-[50dvh]" />
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
                  Redirect to edit product page to add images and details.
                </p>
              </div>
            </div>

            <AlertDialogFooter className="flex-row mt-6">
              <AlertDialogCancel type="button" className="flex-1 sm:flex-none">
                <IconX />
                <span>Cancel</span>
              </AlertDialogCancel>

              <LoadingButton
                type="submit"
                loading={isPending}
                className="flex-1 sm:flex-none"
              >
                <IconSend />
                <span>Submit</span>
              </LoadingButton>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};