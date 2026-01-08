import { createFileRoute } from '@tanstack/react-router';
import { getBannerByIdForAdminQueryOptions } from '@/features/banners/server-functions/admin/get-banner-by-id-for-admin';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { LoadingButton } from '@/components/ui/loading-button';
import { LucideIcon, MonitorIcon, SaveIcon, SmartphoneIcon, TabletIcon, UndoIcon } from 'lucide-react';
import { useEditBannerMutation } from '@/features/banners/server-functions/admin/edit-banner';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FC, useState } from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { BannerImageType } from '@prisma/client';
import {
  EditBannerForm
} from '@/routes/admin/banners/$id/-components/edit-banner-form/form';
import { IImagePickerValue } from '@/components/ui/cover-image-picker';
import BannerImageUploader from '@/routes/admin/banners/$id/-components/edit-banner-form/banner-image-uploader';
import { format } from 'date-fns';
import { editBannerSchema, TEditBannerSchema } from '@/features/banners/schemas/edit-banner';


export const Route = createFileRoute('/admin/banners/$id/edit')({
  component: RouteComponent,
  staticData: { breadcrumbs: { title: 'Edit banner' } },
  loader: async ({ params: { id }, context }) => {
    const data = await context.queryClient.ensureQueryData(getBannerByIdForAdminQueryOptions(id));
    return {
      banner: data,
      breadcrumbs: { title: `Edit «${data.titleRo}»` }
    };
  },
  head: () => ({ meta: [{ title: `Edit banner` }] })
});


interface IBannerUploaderItem {
  type: 'desktop' | 'tablet' | 'mobile';
  label: string;
  icon: LucideIcon;
  className: string;
  image?: IImagePickerValue;
}


function RouteComponent() {
  const { id } = Route.useParams();
  const { data: banner, isPending: isFetching } = useSuspenseQuery(getBannerByIdForAdminQueryOptions(id));
  const [pendingImages, setPendingImages] = useState<Record<BannerImageType, boolean>>({
    desktop: false,
    tablet: false,
    mobile: false
  });

  const form = useForm<TEditBannerSchema>({
    resolver: zodResolver(editBannerSchema),
    defaultValues: { ...banner, path: banner.path ?? '' }
  });

  const { mutate, isPending: isUpdating } = useEditBannerMutation({
    onError: (error) => toast.error(error.name, { description: error.message }),
    onSuccess: data => form.reset({ ...data, path: data.path ?? '' })
  });

  const handleImagePending = (imageType: BannerImageType) => (value: boolean) => {
    setPendingImages(prev => ({ ...prev, [imageType]: value }));
  };

  const isImgPending = Object.values(pendingImages).some(Boolean);

  const desktopImage: IImagePickerValue | undefined = !!banner?.desktopImage
    ? { src: banner.desktopImage.url, thumbhash: banner.desktopImage.thumbhash }
    : undefined;

  const tabletImage: IImagePickerValue | undefined = banner?.tabletImage
    ? { src: banner.tabletImage.url, thumbhash: banner.tabletImage.thumbhash }
    : undefined;

  const mobileImage: IImagePickerValue | undefined = !!banner?.mobileImage
    ? { src: banner.mobileImage.url, thumbhash: banner.mobileImage.thumbhash }
    : undefined;

  const bannerUploaders: IBannerUploaderItem[] = [
    { type: 'desktop', label: 'Desktop', icon: MonitorIcon, className: 'max-w-[30rem]', image: desktopImage },
    { type: 'tablet', label: 'Tablet', icon: TabletIcon, className: 'max-w-[20rem]', image: tabletImage },
    { type: 'mobile', label: 'Phone', icon: SmartphoneIcon, className: 'max-w-[15rem]', image: mobileImage }
  ];

  return (
    <main className="container mx-auto p-4 pb-16 space-y-4 flex-1 relative">
      <p className="text-muted-foreground text-xs">
        Created: {format(banner.createdAt, 'dd.MM.yyyy - HH:mm')},
        Updated: {format(banner.updatedAt, 'dd.MM.yyyy - HH:mm')}
      </p>

      <div className="space-y-4">
        <Label>Images</Label>

        <div className="flex flex-col lg:flex-row gap-4">
          {bannerUploaders.map(({ icon: Icon, label, type, className, image }) => (
            <div key={type} className={cn('flex-1 space-y-2', className)}>
              <div className="flex items-center gap-2">
                <Icon className="size-4"/>
                <Label>{label}</Label>
              </div>

              <BannerImageUploader
                bannerId={id}
                imageType={type}
                defaultImage={image}
                onPendingChange={handleImagePending(type)}
                label={label}
                className="h-36 md:h-42 lg:h-46 w-full"
                imageClassName="object-cover h-full w-full"
              />
            </div>
          ))}
        </div>


      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values: TEditBannerSchema) => mutate({ ...values, id: parseInt(id) }))}
          className="flex flex-col gap-4"
        >
          <EditBannerForm disabled={isFetching || isUpdating || isImgPending}/>
          <BottomButtons
            onResetClick={() => form.reset()}
            disabled={!form.formState.isDirty || isImgPending}
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
            <UndoIcon/>
            <span className="sr-only sm:not-sr-only">Reset</span>
          </Button>
        </div>

        <div className="bg-background shadow-md rounded-md">
          <LoadingButton hideTextOnMobile onClick={onSubmitClick} disabled={disabled} loading={isLoading} type="submit">
            <SaveIcon/>
            <span className="sr-only sm:not-sr-only">Save</span>
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

