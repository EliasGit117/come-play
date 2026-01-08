import { createFileRoute } from '@tanstack/react-router';
import { getProductByIdForAdminQueryOptions } from '@/features/products/server-functions/admin/get-product-by-id-for-admin';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { LoadingButton } from '@/components/ui/loading-button';
import { SaveIcon, UndoIcon } from 'lucide-react';
import { useEditProductMutation } from '@/features/products/server-functions/admin/edit-product';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FC, useState } from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { EditProductForm } from './-components/edit-product-form/form';
import { format } from 'date-fns';
import {
  editProductSchema,
  TEditProductSchema
} from '@/features/products/schemas/edit-product';
import { ProductImagesManager } from './-components/edit-product-form/product-images-manager';

export const Route = createFileRoute('/admin/products/$id/edit')({
  component: RouteComponent,
  staticData: { breadcrumbs: { title: 'Edit product' } },
  loader: async ({ params: { id }, context }) => {
    const data = await context.queryClient.ensureQueryData(
      getProductByIdForAdminQueryOptions(id)
    );
    return {
      product: data,
      breadcrumbs: { title: `Edit «${data.nameRo}»` }
    };
  },
  head: () => ({ meta: [{ title: `Edit product` }] })
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data: product, isPending: isFetching } = useSuspenseQuery(
    getProductByIdForAdminQueryOptions(id)
  );
  const [imagesLoading, setImagesLoading] = useState(false);

  const form = useForm<TEditProductSchema>({
    resolver: zodResolver(editProductSchema),
    defaultValues: { ...product }
  });

  const { mutate, isPending: isUpdating } = useEditProductMutation({
    onError: (error) => toast.error(error.name, { description: error.message }),
    onSuccess: (data) =>
      form.reset({ ...data, })
  });

  const isBusy = isFetching || isUpdating || imagesLoading;

  return (
    <main className="container mx-auto p-4 pb-16 space-y-4 flex-1 relative">
      <p className="text-muted-foreground text-xs">
        Created: {format(product.createdAt, 'dd.MM.yyyy - HH:mm')}, Updated:{' '}
        {format(product.updatedAt, 'dd.MM.yyyy - HH:mm')}
      </p>

      <ProductImagesManager
        productId={parseInt(id)}
        images={product.images ?? []}
        disabled={isBusy}
        onPendingChange={setImagesLoading}
      />

      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit((values) => mutate({ ...values, id: parseInt(id) }))}
        >
          <EditProductForm disabled={isBusy}/>
          <BottomButtons
            onResetClick={() => form.reset()}
            disabled={!form.formState.isDirty || imagesLoading}
            isLoading={isBusy}
          />
        </form>
      </Form>
    </main>
  );
}

interface IBottomButtons {
  disabled?: boolean;
  isLoading?: boolean;
  onResetClick?: () => void;
  onSubmitClick?: () => void;
  className?: string;
}

const BottomButtons: FC<IBottomButtons> = (props) => {
  const {
    disabled,
    isLoading,
    onSubmitClick,
    onResetClick,
    className,
    ...restOfProps
  } = props;
  const { state, isMobile } = useSidebar();

  return (
    <div
      className={cn(
        'fixed bottom-4 left-0 right-0 z-10',
        state === 'expanded' && !isMobile && 'left-[var(--sidebar-width)]',
        className
      )}
      {...restOfProps}
    >
      <div className="flex container mx-auto justify-end ml-auto gap-2 px-4">
        <div className="bg-background shadow-md rounded-md">
          <Button
            type="button"
            variant="secondary"
            disabled={disabled || isLoading}
            onClick={onResetClick}
            className="border"
          >
            <UndoIcon/>
            <span className="sr-only sm:not-sr-only">Reset</span>
          </Button>
        </div>

        <div className="bg-background shadow-md rounded-md">
          <LoadingButton
            hideTextOnMobile
            onClick={onSubmitClick}
            disabled={disabled}
            loading={isLoading}
            type="submit"
          >
            <SaveIcon/>
            <span className="sr-only sm:not-sr-only">Save</span>
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};