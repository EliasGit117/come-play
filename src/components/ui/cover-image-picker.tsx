import { IconCloudUpload, IconUpload, IconX } from '@tabler/icons-react';
'use client';
import { useFileUpload, FileUploadOptions, formatBytes } from '@/hooks/use-file-upload';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import UnLazyImageSSR from '@/components/un-lazy-image-ssr';
import { FC, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { m } from '@/paraglide/messages';


export interface IImagePickerValue {
  src: string;
  thumbhash?: string;
  file?: File;
}

interface INewsImageUploadProps extends Omit<FileUploadOptions,
  'accept' |
  'multiple' |
  'maxFiles' |
  'onFilesChange' |
  'onFilesAdded'
> {
  value?: IImagePickerValue;
  disabled?: boolean;
  keepOpacity?: boolean;
  className?: string;
  onFilesChange?: (file: File | undefined) => void;
  children?: ReactNode;
  imageClassName?: string;
}


const CoverImagePicker: FC<INewsImageUploadProps> = (props) => {
  const {
    value,
    disabled,
    className,
    maxSize = 5 * 1024 * 1024,
    onFilesChange,
    initialFiles,
    children,
    keepOpacity,
    imageClassName,
    ...fileUploadProps
  } = props;

  const [
    { isDragging, errors },
    { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps }
  ] = useFileUpload({
    maxFiles: 1,
    maxSize: maxSize,
    accept: 'image/*',
    multiple: false,
    onFilesChange: (files) => {
      if (files.length <= 0)
        return;

      const firstFile = files[0];
      const file = firstFile.file;
      if (!(file instanceof File))
        return undefined;

      onFilesChange?.(file);
    },
    ...fileUploadProps
  });

  useEffect(() => {
    if (!errors.length) return;

    const errorMsg = errors.join(', ');
    toast.error(m['pages.admin.shared.uploader.error'](), { description: errorMsg });
  }, [errors]);

  const removeImage = () => onFilesChange?.(undefined);

  return (
    <div
      role="button"
      tabIndex={(!!value || disabled) ? -1 : 0}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      className={cn(
        'group relative overflow-hidden rounded-xl transition-all duration-200 border border-border',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        isDragging ? 'border-dashed border-primary bg-primary/5' :
          (!!value ? 'border-border bg-background hover:border-primary/25' : 'border-dashed border-muted-foreground/25 bg-muted/30 hover:border-primary hover:bg-primary/5'),
        disabled && 'pointer-events-none opacity-50',
        keepOpacity && 'opacity-100',
        className
      )}
      onKeyDown={disabled ? undefined : (e) => {
        if (!!value)
          return;

        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openFileDialog();
        }
      }}
    >
      <input {...getInputProps()} className="sr-only" tabIndex={-1}/>

      {!!value ? (
        <>
          <UnLazyImageSSR
            alt="Image"
            src={value.src}
            thumbhash={value.thumbhash}
            className={cn("h-full w-full object-cover", imageClassName)}
          />

          <div
            className={cn(
              'absolute inset-0 bg-black',
              'transition-opacity duration-200 opacity-0',
              !disabled && 'group-hover:opacity-40 group-focus:opacity-40 group-focus-within:opacity-40'
            )}
          />

          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center',
              'opacity-0 transition-opacity duration-200',
              !disabled && 'group-hover:opacity-100  group-focus:opacity-100 group-focus-within:opacity-100'
            )}
          >
            <div className="flex flex-col md:flex-row gap-2">
              <div className="bg-background rounded-md">
                <Button
                  size="sm"
                  onClick={(event) => {
                    event.currentTarget.blur();
                    openFileDialog();
                  }}
                  variant="secondary"
                  aria-label={m['pages.admin.shared.uploader.replace']()}
                  className={cn(
                    'pointer-events-none',
                    !disabled && 'group-hover:pointer-events-auto group-focus-within:pointer-events-auto group-focus:pointer-events-auto'
                  )}
                >
                  <IconUpload/>
                  <span>{m['pages.admin.shared.uploader.replace']()}</span>
                </Button>
              </div>

              <div className="bg-background rounded-md">
                <Button
                  size="sm"
                  onClick={(event) => {
                    event.currentTarget.blur();
                    removeImage();
                  }}
                  variant="destructive"
                  aria-label={m['pages.admin.shared.uploader.remove']()}
                  className={cn(
                    'pointer-events-none',
                    !disabled && 'group-hover:pointer-events-auto group-focus-within:pointer-events-auto group-focus:pointer-events-auto'
                  )}
                >
                  <IconX/>
                  <span>{m['pages.admin.shared.uploader.remove']()}</span>
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div
          onClick={openFileDialog}
          className="flex flex-col gap-4 items-center justify-center w-full h-full cursor-pointer  p-8 text-center"
        >
          <div className="rounded-full bg-primary/10 p-2">
            <IconCloudUpload className="size-5 text-primary"/>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold">{m['pages.admin.shared.uploader.title']()}</h3>
            <p className="text-xs text-muted-foreground">
              {m['pages.admin.shared.uploader.dragAndDrop']({ maxSize: formatBytes(maxSize) })}
            </p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default CoverImagePicker;
