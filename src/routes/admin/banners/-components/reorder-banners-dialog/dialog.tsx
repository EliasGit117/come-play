import { ComponentProps, ComponentPropsWithoutRef, FC, useEffect, useState } from 'react';
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
import { SendIcon, XIcon } from 'lucide-react';
import { useReorderBannersDialogContext } from './provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { getBannersForAdminQueryOptions } from '@/features/banners/server-functions/admin/get-banners-for-admin';
import * as Sortable from '@/components/ui/sortable';
import { IAdminBannerBriefDto } from '@/features/banners/dtos/admin-banner-brief-dto';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { KeyboardSensor, MouseSensor, TouchSensor, useSensor } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';


interface IReorderBannerDialogProps {
  afterSuccess?: () => void;
}

export const ReorderBannersDialog: FC<IReorderBannerDialogProps> = ({ afterSuccess }) => {
  const { isOpen, setIsOpen } = useReorderBannersDialogContext();
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 300, tolerance: 8 } });
  const keyboardSensor = useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates });

  const { data, isPending, refetch } = useQuery({
    ...getBannersForAdminQueryOptions()
  });

  const [items, setItems] = useState<IAdminBannerBriefDto[]>([]);

  useEffect(() => {
    if (!isOpen)
      return;

    void refetch();
  }, [isOpen]);

  useEffect(() => {
    setItems(data ?? []);
  }, [data]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="sm:max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Reorder banners</AlertDialogTitle>
          <AlertDialogDescription/>
        </AlertDialogHeader>

        <ScrollArea className="pr-4 mt-4" type="always">
          {isPending ? (
            <div className="max-h-96 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              <SkeletonList className='h-20' sizeConfig={{ xs: 6, sm: 8, md: 9 }}/>
            </div>
          ) : (
            <div className="max-h-96">
              <Sortable.Root
                sensors={[mouseSensor, touchSensor, keyboardSensor]}
                value={items}
                onValueChange={setItems}
                getItemValue={(item) => item.id}
                orientation="mixed"
              >
                <Sortable.Content className="grid auto-rows-fr grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {items.map((item) => (<SortableCard key={item.id} item={item} asHandle/>))}
                </Sortable.Content>

                <Sortable.Overlay>
                  {(activeItem) => {
                    const item = items.find((trick) => trick.id === activeItem.value);
                    if (!item)
                      return null;

                    return <SortableCard item={item}/>;
                  }}
                </Sortable.Overlay>
              </Sortable.Root>
            </div>
          )}
        </ScrollArea>

        <AlertDialogFooter className="flex-row mt-6">
          <AlertDialogCancel type="button" className="flex-1 sm:flex-none" disabled={isPending}>
            <XIcon/>
            <span>Cancel</span>
          </AlertDialogCancel>

          <LoadingButton type="submit" disabled={isPending} className="flex-1 sm:flex-none">
            <SendIcon/>
            <span>Submit</span>
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface ISortableCardProps
  extends Omit<ComponentPropsWithoutRef<typeof Sortable.Item>, 'value'> {
  item: IAdminBannerBriefDto;
}

const SortableCard: FC<ISortableCardProps> = ({ item, ...props }) => {
  return (
    <Sortable.Item value={item.id} className='touch-manipulation' asChild {...props}>
      <div
        className="flex size-full flex-col gap-1 rounded-md border bg-muted p-2 text-muted-foreground shadow-sm relative overflow-clip h-20">
        <img
          alt={item.title}
          src={item.desktopImage?.url ?? item.tabletImage?.url ?? item.mobileImage?.url}
          className="absolute top-0 left-0 right-0 bottom-0 object-cover h-full w-full brightness-50 dark:brightness-35"
        />
        <div className="font-medium text-sm leading-tight sm:text-base z-10 my-auto mx-auto">
          {item.title}
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

  const size = (isMd && sizeConfig.md) || (isSm && sizeConfig.sm) || (isXs && sizeConfig.xs) || sizeConfig.xs;

  return (
    Array.from({ length: size }).map((_, index) =>
      <Skeleton
        className={cn('flex size-full flex-col gap-1 rounded-md', className)}
        key={index}
        {...props}
      />
    )
  );
};