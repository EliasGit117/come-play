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
import { ImageOffIcon, SendIcon, XIcon } from 'lucide-react';
import { useReorderBannersDialogContext } from './provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getBannersForAdminQueryOptions } from '@/features/banners/server-functions/admin/get-banners-for-admin';
import * as Sortable from '@/components/ui/sortable';
import { IAdminBannerBriefDto } from '@/features/banners/dtos/admin-banner-brief-dto';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { MouseSensor, TouchSensor, useSensor } from '@dnd-kit/core';
import { Badge } from '@/components/ui/badge';
import { useReorderBannersMutation } from '@/features/banners/server-functions/admin/reodred-banners';
import { toast } from 'sonner';


interface IReorderBannerDialogProps {
  afterSuccess?: () => void;
}

export const ReorderBannersDialog: FC<IReorderBannerDialogProps> = ({ afterSuccess }) => {
  const { isOpen, setIsOpen } = useReorderBannersDialogContext();
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 300, tolerance: 8 } });

  const { data, isFetching } = useQuery({
    ...getBannersForAdminQueryOptions(),
    queryKey: [],
    enabled: isOpen,
    staleTime: 0
  });

  const [items, setItems] = useState<IAdminBannerBriefDto[]>([]);

  const { mutate: reoder, isPending: isReordering } = useReorderBannersMutation({
    onSuccess: () => {
      setIsOpen(false);
      afterSuccess?.();
    },
    onError: (e) => toast.error(e.name, { description: e.message })
  });

  useEffect(() => {
    if (isFetching)
      setItems([]);

    setItems(data ?? []);
  }, [data, isFetching]);

  const handleSubmit = () => {
    const ids = items.map((item) => item.id);
    reoder({ bannerIds: ids });
  };

  const isBusy = isFetching || isReordering;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="sm:max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Reorder banners</AlertDialogTitle>
          <AlertDialogDescription/>
        </AlertDialogHeader>

        <ScrollArea className="pr-4 mt-4" type="always">
          {isFetching ? (
            <div className="max-h-[50svh] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              <SkeletonList sizeConfig={{ xs: 6, sm: 8, md: 9 }} className="h-28"/>
            </div>
          ) : (
            <div className="max-h-[50svh]">
              <Sortable.Root
                sensors={isBusy ? [] : [mouseSensor, touchSensor]}
                value={items}
                onValueChange={setItems}
                getItemValue={(item) => item.id}
                orientation="mixed"
              >
                <Sortable.Content className="grid auto-rows-fr grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {items.map((item) => (
                    <SortableCard key={item.id} item={item} className={cn(isBusy && 'opacity-50')} asHandle/>
                  ))}
                </Sortable.Content>

                <Sortable.Overlay>
                  {(activeItem) => {
                    const item = items.find(
                      (trick) => trick.id === activeItem.value
                    );
                    if (!item) return null;

                    return <SortableCard item={item}/>;
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
            disabled={isBusy}
          >
            <XIcon/>
            <span>Cancel</span>
          </AlertDialogCancel>

          <LoadingButton
            type="button"
            onClick={handleSubmit}
            disabled={isBusy}
            loading={isReordering}
            className="flex-1 sm:flex-none"
          >
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
  const img = item.desktopImage ?? item.tabletImage ?? item.mobileImage;

  return (
    <Sortable.Item value={item.id} className="select-none" style={{ touchAction: 'manipulation' }} asChild {...props}>
      <div
        className="flex size-full flex-col gap-1 rounded-md border bg-muted p-1 shadow-sm relative overflow-clip h-28"
      >

        {!!img ? (
          <img
            alt={item.title}
            src={img.url}
            className="absolute top-0 left-0 right-0 bottom-0 object-cover h-full w-full brightness-85 dark:brightness-65 pointer-events-none"
          />
        ) : (
          <ImageOffIcon
            className="text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        )}

        <Badge
          variant="default"
          className={cn(
            'gap-2 py-0.5 px-1.5 m-0 bg-muted-foreground/50 dark:bg-muted-foreground/35',
            'rounded-sm font-semibold mt-auto text-xs z-10 text-white'
          )}
        >
          {item.order}. {item.title}
        </Badge>
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