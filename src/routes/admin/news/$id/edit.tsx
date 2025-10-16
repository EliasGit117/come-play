import { createFileRoute } from '@tanstack/react-router';
import { getNewsByIdQueryOptions } from '@/features/news/server-functions/admin/get-news-by-id';
import { useSuspenseQuery } from '@tanstack/react-query';
import { NewsForm, newsFormSchema, TNewsFormSchema } from '@/routes/admin/news/-components/edit-news-form/form';
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
import { useState } from 'react';
import { IImagePickerValue } from '@/components/ui/cover-image-picker';

export const Route = createFileRoute('/admin/news/$id/edit')({
  component: RouteComponent,
  staticData: {
    breadcrumbs: [{ title: 'Edit news' }]
  },
  loader: async ({ params: { id }, context }) => {
    const data = await context.queryClient.ensureQueryData(getNewsByIdQueryOptions(id));
    return {
      post: data,
      breadcrumbs: [{ title: `Edit «${data.titleRo}»` }]
    };
  },
  head: () => ({ meta: [{ title: `Edit news` }] })
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data: news, isPending: isFetching } = useSuspenseQuery(getNewsByIdQueryOptions(id));
  const [isImgPending, setIsImgPending] = useState<boolean>(false);

  const form = useForm<TNewsFormSchema>({
    resolver: zodResolver(newsFormSchema),
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

  const onSubmit = (values: TNewsFormSchema) => {
    mutate({
      id: parseInt(id),
      ...values
    });
  };


  const imageData: IImagePickerValue | undefined = !!news.image ?
    { src: news.image.url, thumbhash: news.image.thumbhash } :
    undefined;

  const onImagePending = (value: boolean) => setIsImgPending(value);
  const isPending = isFetching || isUpdating || isImgPending;

  return (
    <main className="container mx-auto p-4 pb-12 space-y-4 flex-1 relative">
      <Label>Image</Label>
      <NewsImageUploader newsId={id} defaultImage={imageData} onPendingChange={onImagePending}/>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <NewsForm disabled={isPending}/>
        </form>
      </Form>

      <div className="absolute bottom-4 left-0 right-0 z-10">
        <div className="flex justify-end container mx-auto gap-2 px-4">
          <div className="bg-background shadow-md rounded-md">
            <Button
              type="button"
              variant="secondary"
              disabled={!form.formState.isDirty || isPending}
              onClick={() => form.reset()}
              className="border"
            >
              <UndoIcon/>
              <span className="sr-only sm:not-sr-only">Reset</span>
            </Button>
          </div>

          <div className="bg-background shadow-md rounded-md">
            <LoadingButton onClick={() => form.handleSubmit(onSubmit)()} loading={isPending}>
              <SaveIcon/>
              <span className="sr-only sm:not-sr-only">Save</span>
            </LoadingButton>
          </div>
        </div>
      </div>

    </main>
  );
}

