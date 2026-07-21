import { IconArrowBackUp, IconDeviceFloppy } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import { orpc } from '@/lib/orpc';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import {
  EditNewsForm,
  editNewsFormSchema,
  TEditNewsFormSchema
} from '@/routes/admin/news/$id/-components/edit-news-form/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { LoadingButton } from '@/components/ui/loading-button';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import NewsImageUploader from '@/routes/admin/news/$id/-components/edit-news-form/news-image-uploader';
import { FC, useState } from 'react';
import { IImagePickerValue } from '@/components/ui/cover-image-picker';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { m } from '@/paraglide/messages';


export const Route = createFileRoute('/admin/news/$id/edit')({
  component: RouteComponent,
  staticData: { breadcrumbs: { title: m['pages.admin.news.breadcrumbs.edit']() } },
  loader: async ({ params: { id }, context }) => {
    const data = await context.queryClient.ensureQueryData(orpc.admin.news.getById.queryOptions({ input: { id: Number(id) } }));
    return {
      post: data,
      breadcrumbs: { title: m['pages.admin.news.breadcrumbs.editWithTitle']({ title: data.titleRo }) }
    };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;

    return { meta: [{ title: post ? m['pages.admin.news.head.editWithTitle']({ title: post.titleRo }) : m['pages.admin.news.breadcrumbs.edit']() }] };
  }
});

function RouteComponent() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const { data: news, isPending: isFetching } = useSuspenseQuery(orpc.admin.news.getById.queryOptions({ input: { id: Number(id) } }));
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

  const { mutate, isPending: isUpdating } = useMutation({
    ...orpc.admin.news.update.mutationOptions(),
    onError: (error) => toast.error(error.name, { description: error.message }),
    onSuccess: data => {
      void queryClient.invalidateQueries({ queryKey: orpc.admin.news.key() });
      void queryClient.invalidateQueries({ queryKey: orpc.news.key() });
      form.reset({
        ...data,
        contentRo: data.contentRo ?? undefined,
        contentRu: data.contentRu ?? undefined
      });
    }
  });


  const imageData: IImagePickerValue | undefined = !!news.image ?
    { src: news.image.url, thumbhash: news.image.thumbhash } :
    undefined;

  const onImagePending = (value: boolean) => setIsImgPending(value);

  return (
    <main className="container mx-auto p-4 pb-16 space-y-4 flex-1 relative">
      <p className="text-muted-foreground text-xs">
        {m['pages.admin.shared.meta.created']()}: {format(news.createdAt, 'dd.MM.yyyy - HH:mm')},
        {m['pages.admin.shared.meta.updated']()}: {format(news.updatedAt, 'dd.MM.yyyy - HH:mm')}
      </p>

      <Label>{m['pages.admin.shared.fields.image']()}</Label>
      <NewsImageUploader newsId={id} defaultImage={imageData} onPendingChange={onImagePending}/>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values: TEditNewsFormSchema) => mutate({ id: parseInt(id), ...values }))}
          className="flex flex-col gap-4"
        >
          <EditNewsForm disabled={isFetching || isUpdating || isImgPending}/>

          <BottomButtons
            onResetClick={() => form.reset()}
            disabled={form.formState.isDirty || isImgPending}
            isLoading={isFetching || isUpdating}
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
            <IconArrowBackUp/>
            <span className="sr-only sm:not-sr-only">{m['pages.admin.shared.actions.reset']()}</span>
          </Button>
        </div>

        <div className="bg-background shadow-md rounded-md">
          <LoadingButton loadingText={m['common.loading']()} type="submit" hideTextOnMobile onClick={onSubmitClick} disabled={disabled} loading={isLoading}>
            <IconDeviceFloppy/>
            <span className="sr-only sm:not-sr-only">{m['pages.admin.shared.actions.save']()}</span>
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};