// @/routes/admin/products/$id/-components/edit-product-form/product-images-manager.tsx
import { FC, useState } from 'react';
import { IAdminProductImageDto } from '@/features/products/dtos/admin-product-image-dto';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ImagePlusIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAddProductImageMutation } from '@/features/products/server-functions/admin/add-product-image';
import UnLazyImageSSR from '@/components/un-lazy-image-ssr';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';
import { usedeleteProductImage } from '@/features/products/server-functions/admin/delete-product-image';
import {
  ReorderProductImagesDialog,
  ReorderProductImagesDialogProvider,
  ReorderProductImagesDialogTrigger
} from '@/routes/admin/products/$id/-components/reorder-image-dialog';


interface IProductImagesManagerProps {
  productId: number;
  images: IAdminProductImageDto[];
  disabled?: boolean;
  onPendingChange?: (pending: boolean) => void;
}

export const ProductImagesManager: FC<IProductImagesManagerProps> = ({
                                                                       productId,
                                                                       images,
                                                                       disabled,
                                                                       onPendingChange
                                                                     }) => {
  const [uploadingCount, setUploadingCount] = useState(0);

  const { mutateAsync: addAsync, isPending: isAdding } =
    useAddProductImageMutation({
      onError: (e) => toast.error(e.name, { description: e.message })
    });

  const { mutateAsync: removeAsync, isPending: isRemoving } =
    usedeleteProductImage({ onError: (e) => toast.error(e.name, { description: e.message }) });

  const isBusy = isAdding || isRemoving || uploadingCount > 0;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingCount(files.length);
    onPendingChange?.(true);

    for (const file of files) {
      try {
        await addAsync({ productId, file });
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    setUploadingCount(0);
    onPendingChange?.(false);
    e.target.value = '';
  };

  const handleRemove = async (imageId: number) => {
    await removeAsync({ data: { productId, imageId } });
  };

  // Sort images by their order field
  const sortedImages = [...images].sort((a, b) => {
    // Assuming images have an order property, otherwise sort by id
    return a.id - b.id;
  });

  return (
    <ReorderProductImagesDialogProvider>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label>Product Images ({images.length}/10)</Label>
          <div className="flex gap-2">
            {images.length > 1 && (
              <ReorderProductImagesDialogTrigger
                size="sm"
                variant="outline"
                disabled={disabled || isBusy}
                shortText
              />
            )}
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={disabled || isBusy || images.length >= 10}
              onClick={() =>
                document.getElementById('product-image-input')?.click()
              }
            >
              <ImagePlusIcon />
              <span className="sr-only sm:not-sr-only">Add Image</span>
            </Button>
          </div>
          <input
            id="product-image-input"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {sortedImages.length === 0 && uploadingCount === 0 ? (
          <div className="border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground">
            <p>No images yet. Click "Add Image" to upload.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {sortedImages.map((img, index) => (
              <ProductImageCard
                key={img.id}
                image={img}
                index={index}
                onRemove={() => handleRemove(img.id)}
                disabled={isBusy}
              />
            ))}

            {uploadingCount > 0 &&
              Array.from({ length: uploadingCount }).map((_, i) => (
                <div
                  key={`uploading-${i}`}
                  className="aspect-square rounded-md border bg-muted flex items-center justify-center"
                >
                  <Spinner />
                </div>
              ))}
          </div>
        )}

        <ReorderProductImagesDialog productId={productId} images={images}/>
      </div>
    </ReorderProductImagesDialogProvider>
  );
};

interface IProductImageCardProps {
  image: IAdminProductImageDto;
  index: number;
  onRemove?: () => void;
  disabled?: boolean;
}

const ProductImageCard: FC<IProductImageCardProps> = ({
                                                        image,
                                                        index,
                                                        onRemove,
                                                        disabled
                                                      }) => {
  return (
    <div
      className={cn(
        'aspect-square rounded-md border bg-muted overflow-hidden relative group',
        disabled && 'opacity-50'
      )}
    >
      <UnLazyImageSSR
        src={image.url}
        thumbhash={image.thumbhash}
        alt={`Product image ${index + 1}`}
        className="w-full h-full object-cover pointer-events-none"
      />

      {/* Remove button */}
      {onRemove && (
        <Button
          type="button"
          size="icon-xs"
          variant="destructive"
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          disabled={disabled}
        >
          <TrashIcon className="size-3" />
        </Button>
      )}
    </div>
  );
};