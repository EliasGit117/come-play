'use client';
import { useFileUpload, FileUploadOptions, formatBytes } from '@/hooks/use-file-upload';
import { Button } from '@/components/ui/button';
import { CloudUpload, Upload, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import UnLazyImageSSR from '@/components/un-lazy-image-ssr';
import { ReactNode } from 'react';


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
}


export default function CoverImagePicker(props: INewsImageUploadProps) {
  const {
    value,
    disabled,
    className,
    maxSize = 5 * 1024 * 1024,
    onFilesChange,
    initialFiles,
    children,
    keepOpacity,
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
          (!!value ? 'border-border bg-background hover:border-primary/50' : 'border-dashed border-muted-foreground/25 bg-muted/30 hover:border-primary hover:bg-primary/5'),
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
            src={value.src}
            thumbhash={value.thumbhash}
            alt="Image"
            className="h-full w-full object-cover"
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
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={openFileDialog}
                variant="secondary"
                aria-label="Replace image"
                className={cn(
                  'pointer-events-none',
                  !disabled && 'group-hover:pointer-events-auto group-focus-within:pointer-events-auto group-focus:pointer-events-auto'
                )}
              >
                <Upload/>
                <span>Replace</span>
              </Button>
              <Button
                size="sm"
                onClick={removeImage}
                variant="destructive"
                aria-label="Remove image"
                className={cn(
                  'pointer-events-none',
                  !disabled && 'group-hover:pointer-events-auto group-focus-within:pointer-events-auto group-focus:pointer-events-auto'
                )}
              >
                <XIcon/>
                <span>Remove</span>
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div
          onClick={openFileDialog}
          className="flex flex-col gap-4 items-center justify-center w-full h-full cursor-pointer  p-8 text-center"
        >
          <div className="rounded-full bg-primary/10 p-2">
            <CloudUpload className="size-5 text-primary"/>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold">Upload Image</h3>
            <p className="text-xs text-muted-foreground">Drag and drop an image here, or click to browse. Max
              size: {formatBytes(maxSize)}</p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
