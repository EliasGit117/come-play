import { ComponentProps, FC, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSetNewsImageMutation } from '@/features/news/server-functions/admin/set-news-image';
import { useRemoveImageFromNews } from '@/features/news/server-functions/admin/remove-image-from-news';
import { LoaderCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import CoverImagePicker, { IImagePickerValue } from '@/components/ui/cover-image-picker';


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
  let lastFile: File;

  const { mutate: upload, isPending: isUploading } = useSetNewsImageMutation({
    onError: (e) => {
      setImageData(undefined);
      toast.error(e.name, { description: e.message });
    },
    onSuccess: (res) => setImageData({ thumbhash: res.thumbhash, src: res.url })
  });

  const { mutateAsync: removeAsync, isPending: isRemoving } = useRemoveImageFromNews({
    onError: (e) => toast.error(e.name, { description: e.message }),
    onSuccess: () => setImageData(undefined)
  });

  const isPending = isUploading || isRemoving;
  useEffect(() => onPendingChange?.(isPending), [isPending]);

  const onFilesChange = async (file: File | undefined) => {
    if (isPending)
      return;

    if (!file) {
      await removeAsync({ data: { newsId: numNewsId } });
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
            <LoaderCircleIcon className="animate-spin"/>
            <span className="text-sm font-medium">
              {isUploading && 'Uploading...'}
              {isRemoving && 'Removing...'}
            </span>
          </div>
        )}
      </CoverImagePicker>

    </div>
  );
};

export default NewsImageUploader;
