// routes/admin/banners/-components/banner-image-uploader.tsx
import { ComponentProps, FC, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSetBannerImageMutation } from '@/features/banners/server-functions/admin/set-banner-image';
import { useRemoveBannerImage } from '@/features/banners/server-functions/admin/remove-banner-image';
import { cn } from '@/lib/utils';
import CoverImagePicker, { IImagePickerValue } from '@/components/ui/cover-image-picker';
import { Spinner } from '@/components/ui/spinner';
import { BannerImageType } from '@prisma/client';

interface IBannerImageUploaderProps extends ComponentProps<typeof CoverImagePicker> {
  bannerId: number | string;
  imageType: BannerImageType;
  defaultImage?: IImagePickerValue;
  disabled?: boolean;
  onPendingChange?: (value: boolean) => void;
  label?: string;
}

export const BannerImageUploader: FC<IBannerImageUploaderProps> = (props) => {
  const {
    disabled,
    bannerId,
    imageType,
    defaultImage,
    className,
    onPendingChange,
    label,
    ...restOfProps
  } = props;

  const numBannerId = typeof bannerId === 'number' ? bannerId : parseInt(bannerId);
  const [imageData, setImageData] = useState<IImagePickerValue | undefined>(defaultImage);
  let lastFile: File;

  const { mutate: upload, isPending: isUploading } = useSetBannerImageMutation({
    onError: (e) => {
      setImageData(undefined);
      toast.error(e.name, { description: e.message });
    },
    onSuccess: (res) => setImageData({ thumbhash: res.thumbhash, src: res.url })
  });

  const { mutateAsync: removeAsync, isPending: isRemoving } = useRemoveBannerImage({
    onError: (e) => toast.error(e.name, { description: e.message }),
    onSuccess: () => setImageData(undefined)
  });

  const isPending = isUploading || isRemoving;
  useEffect(() => onPendingChange?.(isPending), [isPending]);

  const onFilesChange = async (file: File | undefined) => {
    if (isPending) return;

    if (!file) {
      await removeAsync({ data: { bannerId: numBannerId, imageType } });
      return;
    }

    if (file === lastFile) return;

    lastFile = file;

    setTimeout(() => {
      setImageData({ src: URL.createObjectURL(file) });
      upload({ bannerId: numBannerId, imageType, file });
    }, 0);
  };

  if (isNaN(numBannerId))
    throw new Error('Provided id is not parsable to number');

  return (
    <CoverImagePicker
      className={cn(
        'w-full h-full relative',
        disabled && !isPending && 'opacity-50',
        className
      )}
      value={imageData}
      onFilesChange={onFilesChange}
      disabled={disabled || isPending}
      keepOpacity
      {...restOfProps}
    >
      {isPending && (
        <div className="absolute inset-0 flex gap-1 items-center justify-center bg-black/40 text-white z-10">
          <Spinner/>
          <span className="text-sm font-medium">
            {isUploading && 'Uploading...'}
            {isRemoving && 'Removing...'}
          </span>
        </div>
      )}
    </CoverImagePicker>
  );
};

export default BannerImageUploader;