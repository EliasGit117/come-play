import { createFileRoute } from '@tanstack/react-router';
import { getNewsByIdQueryOptions } from '@/features/news/server-functions/admin/get-news-by-id';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  EditNewsForm,
  editNewsFormSchema,
  TEditNewsFormSchema
} from '@/routes/admin/news/-components/edit-news-form/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { LoadingButton } from '@/components/ui/loading-button';
import { SaveIcon, UndoIcon } from 'lucide-react';
import { useEditNewsMutation } from '@/features/news/server-functions/admin/edit-news';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import NewsImageUploader from '@/routes/admin/news/-components/edit-news-form/news-image-uploader';
import { FC, useState } from 'react';
import { IImagePickerValue } from '@/components/ui/cover-image-picker';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';


export const Route = createFileRoute('/admin/news/$id/edit')({
  component: RouteComponent,
  staticData: { breadcrumbs: { title: 'Edit news' } },
  loader: async ({ params: { id }, context }) => {
    const data = await context.queryClient.ensureQueryData(getNewsByIdQueryOptions(id));
    return {
      post: data,
      breadcrumbs: { title: `Edit «${data.titleRo}»` }
    };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;

    return { meta: [{ title: post ? `Edit news «${post.titleRo}»` : 'Edit news' }] };
  }
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data: news, isPending: isFetching } = useSuspenseQuery(getNewsByIdQueryOptions(id));
  const [isImgPending, setIsImgPending] = useState<boolean>(false);

  const form = useForm<TEditNewsFormSchema>({
    resolver: zodResolver(editNewsFormSchema),
    defaultValues: {
      titleRo: news.titleRo,
      titleRu: news.titleRu,
      status: news.status,
      contentRo: news.contentRo ?? '',
      contentRu: news.contentRu ?? '',
      slug: news.slug
    }
  });

  const { mutate, isPending: isUpdating } = useEditNewsMutation({
    onError: (error) => toast.error(error.name, { description: error.message }),
    onSuccess: data => form.reset({
      ...data,
      contentRo: data.contentRo ?? undefined,
      contentRu: data.contentRu ?? undefined
    })
  });


  const imageData: IImagePickerValue | undefined = !!news.image ?
    { src: news.image.url, thumbhash: news.image.thumbhash } :
    undefined;

  const onImagePending = (value: boolean) => setIsImgPending(value);
  const isPending = isFetching || isUpdating || isImgPending;

  return (
    <main className="container mx-auto p-4 pb-12 space-y-4 flex-1 relative">
      <p className="text-muted-foreground text-xs">
        Created: {format(news.createdAt, 'dd.MM.yyyy - HH:mm')},
        Updated: {format(news.updatedAt, 'dd.MM.yyyy - HH:mm')}
      </p>

      <Label>Image</Label>
      <NewsImageUploader newsId={id} defaultImage={imageData} onPendingChange={onImagePending}/>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values: TEditNewsFormSchema) => mutate({ id: parseInt(id), ...values }))}
          className="flex flex-col gap-4"
        >
          <EditNewsForm disabled={isPending}/>

          <BottomButtons
            onResetClick={() => form.reset()}
            disabled={form.formState.isDirty}
            isLoading={isPending}
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
  const { disabled, isLoading, onSubmitClick, onResetClick, className, ...restOfProps } = props;
  const { state, isMobile } = useSidebar();

  return (
    <div
      className={cn(
        'fixed bottom-4 left-0 right-0 z-10',
        (state === 'expanded' && !isMobile) && 'left-[var(--sidebar-width)]',
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
          <LoadingButton type="submit" hideTextOnMobile onClick={onSubmitClick} loading={isLoading}>
            <SaveIcon/>
            <span className="sr-only sm:not-sr-only">Save</span>
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};