import { createColumnHelper } from '@tanstack/react-table';
import { IAdminNewsBriefDto } from '@/features/news/dtos/admin-news-brief-dto';
import { format } from 'date-fns';
import { NewsStatus } from '@prisma/client';
import {
  IconCalendarClock,
  IconCalendarPlus,
  IconDots,
  IconEye,
  IconEyeOff,
  IconHash,
  IconHeading,
  IconPhoto, IconPhotoOff,
  IconLink,
  IconListCheck,
  IconPencil,
  IconTrash
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ColumnFilterType, DataTableColumnHeader } from '@/components/data-table';
import { Link, useNavigate } from '@tanstack/react-router';
import UnLazyImageSSR from '@/components/un-lazy-image-ssr';
import { Checkbox } from '@/components/ui/checkbox';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { orpc } from '@/lib/orpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { m } from '@/paraglide/messages';


const columnHelper = createColumnHelper<IAdminNewsBriefDto>();

interface INewsColumnsOptions {
  disabled?: boolean;
}

export const newsColumns = (options?: INewsColumnsOptions) => {
  const { disabled } = options ?? {};

  return ([
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
      cell: ctx => ctx.getValue(),
      meta: {
        label: m['pages.admin.shared.table.id'](),
        key: 'idRange',
        icon: IconHash,
        skeletonClassName: 'w-10 h-6',
        filter: {
          type: ColumnFilterType.NumberRange,
          min: 1,
          max: 5000
        }
      }
    }),
    columnHelper.accessor('image', {
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => {
        const img = ctx.getValue();

        if (!img)
          return (
            <div
              className="h-10 aspect-video rounded-sm bg-muted text-muted-foreground/50 border justify-center items-center flex">
              <IconPhotoOff className="size-5"/>
            </div>
          );

        return (
          <figure className="h-10 aspect-video rounded-sm overflow-hidden border border-border/50 bg-muted">
            <UnLazyImageSSR
              src={img.url}
              thumbhash={img.thumbhash}
              className="w-full h-full object-cover"
              alt="News image"
            />
          </figure>
        );
      },
      meta: {
        label: m['pages.admin.news.table.columns.image'](),
        key: 'hasImage',
        icon: IconPhoto,
        skeletonClassName: 'h-10 w-18',
        filter: {
          type: ColumnFilterType.Select,
          options: [
            { title: m['pages.admin.shared.table.yes'](), value: true, icon: IconPhoto },
            { title: m['pages.admin.shared.table.no'](), value: false, icon: IconPhotoOff }
          ]
        }
      }
    }),
    columnHelper.accessor('title', {
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => ctx.getValue(),
      meta: {
        label: m['pages.admin.shared.table.title'](),
        icon: IconHeading,
        skeletonClassName: 'h-6 w-40',
        filter: {
          type: ColumnFilterType.Text,
          placeholder: m['pages.admin.shared.table.searchByTitle']()
        }
      }
    }),
    columnHelper.accessor('slug', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => ctx.getValue(),
      meta: {
        label: m['pages.admin.shared.table.slug'](),
        icon: IconLink,
        skeletonClassName: 'h-6 w-36',
        filter: { type: ColumnFilterType.Text, placeholder: m['pages.admin.shared.table.searchBySlug']() }
      }
    }),
    columnHelper.accessor('status', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ({ getValue }) =>
        <Badge variant="outline" className="gap-2 py-1 px-2 m-0">
          {getValue() === NewsStatus.hidden ? (
            <IconEyeOff className="size-3.5 text-muted-foreground"/>
          ) : (
            <IconEye className="size-3.5 text-muted-foreground"/>
          )}
          <span className="capitalize">
            {getValue() === NewsStatus.hidden ? m['pages.admin.shared.status.hidden']() : m['pages.admin.shared.status.published']()}
          </span>
        </Badge>,
      meta: {
        label: m['pages.admin.news.table.columns.status'](),
        icon: IconListCheck,
        skeletonClassName: 'h-6 w-20',
        filter: {
          type: ColumnFilterType.MultiSelect,
          options: [
            { title: m['pages.admin.shared.status.hidden'](), value: NewsStatus.hidden, icon: IconEyeOff },
            { title: m['pages.admin.shared.status.published'](), value: NewsStatus.published, icon: IconEye }
          ]
        }
      }
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => <span className="text-xs">{format(ctx.getValue(), 'dd.MM.yyyy - HH:mm')}</span>,
      meta: {
        label: m['pages.admin.shared.table.created'](),
        icon: IconCalendarPlus,
        skeletonClassName: 'h-6 w-30',
        filter: {
          type: ColumnFilterType.DateRange
        }
      }
    }),
    columnHelper.accessor('updatedAt', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => <span className="text-xs">{format(ctx.getValue(), 'dd.MM.yyyy - HH:mm')}</span>,
      meta: {
        label: m['pages.admin.shared.table.updated'](),
        icon: IconCalendarClock,
        skeletonClassName: 'h-6 w-30',
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
        skeletonClassName: 'ml-auto h-7 w-7'
      },
      cell: (ctx) => {
        const navigate = useNavigate();
        const confirm = useConfirm();
        const queryClient = useQueryClient();
        const id = ctx.row.getValue<number>('id');
        const slug = ctx.row.getValue<string>('slug');

        const { isPending: isDeleting, mutateAsync: deleteAsync } = useMutation({
          ...orpc.admin.news.delete.mutationOptions(),
          onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: orpc.admin.news.key() });
          }
        });

        const handleDelete = async () => {
          const isConfirmed = await confirm({
            title: m['pages.admin.news.delete.confirmTitle'](),
            description: m['pages.admin.news.delete.confirmDescriptionSingle'](),
            confirmText: m['pages.admin.shared.actions.delete'](),
            cancelText: m['common.cancel']()
          });

          if (!isConfirmed)
            return;

          toast.promise(deleteAsync({ id }), {
            loading: m['pages.admin.news.delete.loadingToast'](),
            success: m['pages.admin.news.delete.successToast'](),
            error: (err) => err instanceof Error ? err.message : m['pages.admin.news.delete.errorToast']()
          });
        };

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger disabled={disabled || isDeleting} asChild>
                <Button size="icon-xs" variant="ghost">
                  <IconDots/>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuLabel>
                  {m['pages.admin.shared.actions.actions']()}
                </DropdownMenuLabel>

                <DropdownMenuSeparator/>

                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate({ to: '/news/$slug', params: { slug: slug } })}>
                    <span>{m['pages.admin.shared.actions.goToPage']()}</span>
                    <IconLink className="ml-auto size-4"/>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/admin/news/$id/edit" params={{ id: `${id}` }}>
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
  ]);
};
