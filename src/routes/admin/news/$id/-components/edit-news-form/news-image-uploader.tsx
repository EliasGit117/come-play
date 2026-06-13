import { ComponentProps, FC, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { orpc } from '@/lib/orpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cn } from '@/lib/utils';
import CoverImagePicker, { IImagePickerValue } from '@/components/ui/cover-image-picker';
import { Spinner } from '@/components/ui/spinner';
import { m } from '@/paraglide/messages';


interface INewsImageUploaderProps extends ComponentProps<'div'> {
  newsId: number | string;
  defaultImage?: IImagePickerValue;
  disabled?: boolean;
  onPendingChange?: (value: boolean) => void;
}

export const NewsImageUploader: FC<INewsImageUploaderProps> = (props) => {
  const { disabled, newsId, defaultImage, className, onPendingChange, ...restOfProps } = props;

  const numNewsId = typeof newsId === 'number' ? newsId : parseInt(newsId);
  const [imageData, setImageData] = useState<IImagePickerValue | undefined>(defaultImage);
  const queryClient = useQueryClient();
  let lastFile: File;

  const { mutate: upload, isPending: isUploading } = useMutation({
    ...orpc.admin.news.setImage.mutationOptions(),
    onError: (e) => {
      setImageData(undefined);
      toast.error(e.name, { description: e.message });
    },
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: orpc.admin.news.key() });
      setImageData({ thumbhash: res.thumbhash, src: res.url });
    }
  });

  const { mutateAsync: removeAsync, isPending: isRemoving } = useMutation({
    ...orpc.admin.news.removeImage.mutationOptions(),
    onError: (e) => toast.error(e.name, { description: e.message }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orpc.admin.news.key() });
      setImageData(undefined);
    }
  });

  const isPending = isUploading || isRemoving;
  useEffect(() => onPendingChange?.(isPending), [isPending]);

  const onFilesChange = async (file: File | undefined) => {
    if (isPending)
      return;

    if (!file) {
      await removeAsync({ newsId: numNewsId });
      return;
    }

    if (file === lastFile)
      return;

    lastFile = file;

    setTimeout(() => {
      setImageData({ src: URL.createObjectURL(file) });
      upload({ newsId: numNewsId, file });
    }, 0);
  };

  if (isNaN(numNewsId))
    throw new Error('Provided id is not parsable to number');

  return (
    <div className={cn(className)} {...restOfProps}>
      <CoverImagePicker
        className={cn("max-w-xs aspect-video relative", disabled && !isPending && 'opacity-50')}
        value={imageData}
        onFilesChange={onFilesChange}
        disabled={disabled || isPending}
        keepOpacity
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

    </div>
  );
};

export default NewsImageUploader;
