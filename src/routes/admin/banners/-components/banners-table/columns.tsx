import { createColumnHelper } from '@tanstack/react-table';
import { IAdminBannerBriefDto } from '@/features/banners/dtos/admin-banner-brief-dto';
import { format } from 'date-fns';
import {
  IconCalendarClock,
  IconCalendarPlus,
  IconCheck,
  IconDots,
  IconHash,
  IconHeading,
  IconPhoto,
  IconPhotoOff,
  IconLink,
  IconListNumbers,
  IconDeviceDesktop,
  IconPencil,
  IconDeviceMobile,
  IconDeviceTablet,
  IconTrash,
  IconX
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  ColumnFilterType,
  DataTableColumnHeader
} from '@/components/data-table';
import { Link, useNavigate } from '@tanstack/react-router';
import UnLazyImageSSR from '@/components/un-lazy-image-ssr';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { orpc } from '@/lib/orpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { m } from '@/paraglide/messages';


const columnHelper = createColumnHelper<IAdminBannerBriefDto>();

interface IBannerColumnsOptions {
  disabled?: boolean;
}

export const bannerColumns = (options?: IBannerColumnsOptions) => {
  const { disabled } = options ?? {};

  return [
    columnHelper.display({
      id: 'select',
      size: 32,
      enableSorting: false,
      enableHiding: false,
      header: ({ table }) => (
        <Checkbox
          disabled={disabled}
          aria-label="Select all"
          className="translate-y-0.5"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          disabled={disabled}
          aria-label="Select row"
          className="translate-y-0.5 mr-2"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      meta: {
        label: m['pages.admin.shared.table.select'](),
        skeletonClassName: 'w-6 h-6'
      }
    }),
    columnHelper.accessor('id', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: (ctx) => ctx.getValue(),
      meta: {
        label: m['pages.admin.shared.table.id'](),
        key: 'idRange',
        icon: IconHash,
        skeletonClassName: 'h-6 w-8',
        filter: {
          type: ColumnFilterType.NumberRange,
          min: 1,
          max: 5000
        }
      }
    }),
    columnHelper.accessor('order', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: (ctx) => ctx.getValue(),
      meta: {
        label: m['pages.admin.banners.table.columns.order'](),
        icon: IconListNumbers,
        skeletonClassName: 'h-6 w-8'
      }
    }),
    columnHelper.accessor(row => row, {
      id: 'images',
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: (ctx) => {
        const { desktopImage, tabletImage, mobileImage } = ctx.row.original;

        const renderImage = (img: any, label: string, className: string) => {
          if (!img)
            return (
              <div
                className={`${className} rounded-sm bg-muted text-muted-foreground/50 border justify-center items-center flex`}
                title={`${label} — No image`}
              >
                <IconPhotoOff className="size-5"/>
              </div>
            );

          return (
            <figure className={`${className} rounded-sm overflow-hidden border border-border/50 bg-muted`}
                    title={label}>
              <UnLazyImageSSR
                src={img.url}
                thumbhash={img.thumbhash}
                className="w-full h-full object-cover"
                alt={`${label} banner`}
              />
            </figure>
          );
        };

        return (
          <div className="flex gap-2 items-center">
            {renderImage(desktopImage, 'Desktop', 'w-28 h-12')}
            {renderImage(tabletImage, 'Tablet', 'w-24 h-12')}
            {renderImage(mobileImage, 'Mobile', 'w-20 h-12')}
          </div>
        );
      },
      meta: {
        label: m['pages.admin.banners.table.columns.images'](),
        icon: IconPhoto,
        key: 'images',
        filter: {
          type: ColumnFilterType.MultiSelect,
          options: [
            { title: m['pages.admin.banners.table.filters.hasDesktop'](), value: 'desktop', icon: IconDeviceDesktop },
            { title: m['pages.admin.banners.table.filters.hasTablet'](), value: 'tablet', icon: IconDeviceTablet },
            { title: m['pages.admin.banners.table.filters.hasMobile'](), value: 'mobile', icon: IconDeviceMobile }
          ]
        },
        skeletonItem:
          <div className="flex gap-2 items-center">
            <Skeleton className="w-28 h-11"/>
            <Skeleton className="w-24 h-11"/>
            <Skeleton className="w-20 h-11"/>
          </div>
      }
    }),
    columnHelper.accessor('path', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: (ctx) => (
        <p className="text-xs italic">{ctx.getValue() || '-'}</p>
      ),
      meta: {
        label: m['pages.admin.banners.table.columns.path'](),
        icon: IconLink,
        skeletonClassName: 'h-6 w-32',
        filter: {
          type: ColumnFilterType.Text,
          placeholder: m['pages.admin.banners.table.filters.searchByPath']()
        }
      }
    }),
    columnHelper.accessor('title', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: (ctx) => <p className="text-xs">{ctx.getValue()}</p>,
      meta: {
        label: m['pages.admin.shared.table.title'](),
        icon: IconHeading,
        skeletonClassName: 'h-6 w-32',
        filter: {
          type: ColumnFilterType.Text,
          placeholder: m['pages.admin.shared.table.searchByTitle']()
        }
      }
    }),
    columnHelper.accessor('isActive', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ({ getValue }) => (
        <Badge variant="outline" className="gap-2 py-1 px-2 m-0">
          {getValue() ? (
            <IconCheck className="size-3.5"/>
          ) : (
            <IconX className="size-3.5"/>
          )}
          <span>{getValue() ? m['pages.admin.banners.table.status.active']() : m['pages.admin.banners.table.status.inactive']()}</span>
        </Badge>
      ),
      meta: {
        label: m['pages.admin.banners.table.columns.isActive'](),
        icon: IconCheck,
        skeletonClassName: 'h-6 w-20',
        filter: {
          type: ColumnFilterType.Select,
          options: [
            { title: m['pages.admin.banners.table.status.active'](), value: true, icon: IconCheck },
            { title: m['pages.admin.banners.table.status.inactive'](), value: false, icon: IconX }
          ]
        }
      }
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: (ctx) => (
        <span className="text-xs">
          {format(ctx.getValue(), 'dd.MM.yyyy - HH:mm')}
        </span>
      ),
      meta: {
        label: m['pages.admin.shared.table.created'](),
        icon: IconCalendarPlus,
        skeletonClassName: 'h-6 w-26',
        filter: {
          type: ColumnFilterType.DateRange
        }
      }
    }),
    columnHelper.accessor('updatedAt', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: (ctx) => (
        <span className="text-xs">
          {format(ctx.getValue(), 'dd.MM.yyyy - HH:mm')}
        </span>
      ),
      meta: {
        label: m['pages.admin.shared.table.updated'](),
        icon: IconCalendarClock,
        skeletonClassName: 'h-6 w-26',
        filter: {
          type: ColumnFilterType.DateRange
        }
      }
    }),
    columnHelper.display({
      id: 'actions',
      size: 44,
      meta: {
        label: m['pages.admin.shared.actions.actions'](),
        skeletonClassName: 'h-7 w-7 ml-auto'
      },
      cell: (ctx) => {
        const navigate = useNavigate();
        const confirm = useConfirm();
        const queryClient = useQueryClient();
        const id = ctx.row.getValue<number>('id');
        const path = ctx.row.getValue<string | null>('path');

        const { isPending: isDeleting, mutateAsync: deleteAsync } = useMutation({
          ...orpc.admin.banners.delete.mutationOptions(),
          onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: orpc.admin.banners.key() });
          }
        });

        const handleDelete = async () => {
          const isConfirmed = await confirm({
            title: m['pages.admin.banners.delete.confirmTitleSingle'](),
            description: m['pages.admin.banners.delete.confirmDescriptionSingle'](),
            confirmText: m['pages.admin.shared.actions.delete'](),
            cancelText: m['common.cancel']()
          });

          if (!isConfirmed)
            return;

          toast.promise(deleteAsync({ id }), {
            loading: m['pages.admin.banners.delete.loadingToastSingle'](),
            success: m['pages.admin.banners.delete.successToastSingle'](),
            error: (err) => err instanceof Error ? err.message : m['pages.admin.banners.delete.errorToastSingle']()
          });
        };

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger className="" disabled={disabled || isDeleting} asChild>
                <Button size="icon-xs" variant="ghost">
                  <IconDots/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-fit min-w-56" align="end">
                <DropdownMenuLabel>
                  {m['pages.admin.shared.actions.actions']()}
                </DropdownMenuLabel>

                <DropdownMenuSeparator/>

                <DropdownMenuGroup>
                  {path && (
                    <DropdownMenuItem
                      onClick={() => navigate({ to: path })}
                    >
                      <span>{m['pages.admin.shared.actions.goToPage']()}</span>
                      <IconLink className="ml-auto size-4"/>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild>
                    <Link to="/admin/banners/$id/edit" params={{ id: `${id}` }}>
                      <span>{m['pages.admin.shared.actions.edit']()}</span>
                      <IconPencil className="ml-auto size-4"/>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator/>

                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                    <span>{m['pages.admin.shared.actions.delete']()}</span>
                    <IconTrash className="ml-auto size-4"/>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      }
    })
  ];
};