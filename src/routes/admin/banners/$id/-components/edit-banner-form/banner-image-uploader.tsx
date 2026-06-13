import { ComponentProps, FC, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { orpc } from '@/lib/orpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import CoverImagePicker, { IImagePickerValue } from '@/components/ui/cover-image-picker';
import { Spinner } from '@/components/ui/spinner';
import { BannerImageType } from '@prisma/client';
import { m } from '@/paraglide/messages';

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
  const queryClient = useQueryClient();
  let lastFile: File;

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: orpc.admin.banners.key() });

  const { mutate: upload, isPending: isUploading } = useMutation({
    ...orpc.admin.banners.setImage.mutationOptions(),
    onError: (e) => {
      setImageData(undefined);
      toast.error(e.name, { description: e.message });
    },
    onSuccess: (res) => {
      void invalidate();
      setImageData({ thumbhash: res.thumbhash, src: res.url });
    }
  });

  const { mutateAsync: removeAsync, isPending: isRemoving } = useMutation({
    ...orpc.admin.banners.removeImage.mutationOptions(),
    onError: (e) => toast.error(e.name, { description: e.message }),
    onSuccess: () => {
      void invalidate();
      setImageData(undefined);
    }
  });

  const isPending = isUploading || isRemoving;
  useEffect(() => onPendingChange?.(isPending), [isPending]);

  const onFilesChange = async (file: File | undefined) => {
    if (isPending)
      return;

    if (!file) {
      await removeAsync({ bannerId: numBannerId, imageType });
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
            {isUploading && m['pages.admin.shared.uploader.uploading']()}
            {isRemoving && m['pages.admin.shared.uploader.removing']()}
          </span>
        </div>
      )}
    </CoverImagePicker>
  );
};

export default BannerImageUploader;