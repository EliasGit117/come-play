import { ComponentProps, FC, useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { LoadingButton } from '@/components/ui/loading-button';
import { ImageOffIcon, SendIcon, XIcon } from 'lucide-react';
import { useReorderProductImagesDialogContext } from './provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import * as Sortable from '@/components/ui/sortable';
import { IAdminProductImageDto } from '@/features/products/dtos/admin-product-image-dto';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { MouseSensor, TouchSensor, useSensor } from '@dnd-kit/core';
import { useReorderProductImagesMutation } from '@/features/products/server-functions/admin/reorder-product-images';
import { toast } from 'sonner';
import UnLazyImageSSR from '@/components/un-lazy-image-ssr';

interface IReorderProductImagesDialogProps {
  productId: number;
  images: IAdminProductImageDto[];
  afterSuccess?: () => void;
}

export const ReorderProductImagesDialog: FC<
  IReorderProductImagesDialogProps
> = ({ productId, images, afterSuccess }) => {
  const { isOpen, setIsOpen } = useReorderProductImagesDialogContext();
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 300, tolerance: 8 }
  });

  const [items, setItems] = useState<IAdminProductImageDto[]>([]);

  const { mutate: reorder, isPending: isReordering } =
    useReorderProductImagesMutation({
      onSuccess: () => {
        setIsOpen(false);
        afterSuccess?.();
      },
      onError: (e) => toast.error(e.name, { description: e.message })
    });

  useEffect(() => {
    if (isOpen) {
      setItems([...images].sort((a, b) => a.id - b.id));
    }
  }, [images, isOpen]);

  const handleSubmit = () => {
    const ids = items.map((item) => item.id);
    reorder({ productId, imageIds: ids });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="sm:max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Reorder product images</AlertDialogTitle>
          <AlertDialogDescription>
            Drag and drop images to reorder them. The first image will be the
            main product image.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="pr-4 mt-4" type="always">
          {items.length === 0 ? (
            <div className="max-h-[50svh] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              <SkeletonList sizeConfig={{ xs: 6, sm: 8, md: 9 }} className="h-28" />
            </div>
          ) : (
            <div className="max-h-[50svh]">
              <Sortable.Root
                sensors={isReordering ? [] : [mouseSensor, touchSensor]}
                value={items}
                onValueChange={setItems}
                getItemValue={(item) => item.id}
                orientation="mixed"
              >
                <Sortable.Content className="grid auto-rows-fr grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {items.map((item, index) => (
                    <SortableImageCard
                      key={item.id}
                      item={item}
                      index={index}
                      className={cn(isReordering && 'opacity-50')}
                      asHandle
                    />
                  ))}
                </Sortable.Content>

                <Sortable.Overlay>
                  {(activeItem) => {
                    const item = items.find((img) => img.id === activeItem.value);
                    if (!item) return null;
                    return <SortableImageCard item={item} index={0} />;
                  }}
                </Sortable.Overlay>
              </Sortable.Root>
            </div>
          )}
        </ScrollArea>

        <AlertDialogFooter className="flex-row mt-6">
          <AlertDialogCancel
            type="button"
            className="flex-1 sm:flex-none"
            disabled={isReordering}
          >
            <XIcon />
            <span>Cancel</span>
          </AlertDialogCancel>

          <LoadingButton
            type="button"
            onClick={handleSubmit}
            disabled={isReordering || items.length === 0}
            loading={isReordering}
            className="flex-1 sm:flex-none"
          >
            <SendIcon />
            <span>Submit</span>
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface ISortableImageCardProps
  extends Omit<ComponentProps<typeof Sortable.Item>, 'value'> {
  item: IAdminProductImageDto;
  index: number;
}

const SortableImageCard: FC<ISortableImageCardProps> = ({
                                                          item,
                                                          index,
                                                          ...props
                                                        }) => {
  return (
    <Sortable.Item
      value={item.id}
      className="select-none"
      style={{ touchAction: 'manipulation' }}
      asChild
      {...props}
    >
      <div className="flex size-full flex-col gap-1 rounded-md border bg-muted p-1 shadow-sm relative overflow-clip h-28">
        {item.url ? (
          <img
            src={item.url}
            alt={`Product image ${index + 1}`}
            className="absolute top-0 left-0 right-0 bottom-0 object-cover h-full w-full brightness-85 dark:brightness-65 pointer-events-none"
          />
        ) : (
          <ImageOffIcon className="text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        )}

        <div
          className={cn(
            'gap-2 py-0.5 px-1.5 m-0 bg-muted-foreground/50 dark:bg-muted-foreground/35',
            'rounded-sm font-semibold mt-auto text-xs z-10 text-white w-fit'
          )}
        >
          {index + 1}
        </div>
      </div>
    </Sortable.Item>
  );
};

interface ISkeletonList extends ComponentProps<typeof Skeleton> {
  sizeConfig: {
    xs: number;
    sm?: number;
    md?: number;
  };
}

const SkeletonList: FC<ISkeletonList> = ({ sizeConfig, className, ...props }) => {
  const isXs = useMediaQuery('(max-width: 480px)');
  const isSm = useMediaQuery('(max-width: 768px) and (min-width: 481px)');
  const isMd = useMediaQuery('(min-width: 769px)');

  const size =
    (isMd && sizeConfig.md) ||
    (isSm && sizeConfig.sm) ||
    (isXs && sizeConfig.xs) ||
    sizeConfig.xs;

  return Array.from({ length: size }).map((_, index) => (
    <Skeleton
      className={cn('flex size-full flex-col gap-1 rounded-md', className)}
      key={index}
      {...props}
    />
  ));
};