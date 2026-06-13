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
  IconPencil
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
        label: 'Select',
        skeletonClassName: 'w-6 h-6'
      }
    }),
    columnHelper.accessor('id', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => ctx.getValue(),
      meta: {
        label: 'Id',
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
        label: 'Image',
        key: 'hasImage',
        icon: IconPhoto,
        skeletonClassName: 'h-10 w-18',
        filter: {
          type: ColumnFilterType.Select,
          options: [
            { title: 'Yes', value: true, icon: IconPhoto },
            { title: 'No', value: false, icon: IconPhotoOff }
          ]
        }
      }
    }),
    columnHelper.accessor('title', {
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => ctx.getValue(),
      meta: {
        label: 'Title',
        icon: IconHeading,
        skeletonClassName: 'h-6 w-40',
        filter: {
          type: ColumnFilterType.Text,
          placeholder: 'Search by title'
        }
      }
    }),
    columnHelper.accessor('slug', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => ctx.getValue(),
      meta: {
        label: 'Slug',
        icon: IconLink,
        skeletonClassName: 'h-6 w-36',
        filter: { type: ColumnFilterType.Text, placeholder: 'Search by slug' }
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
          <span className="capitalize">{getValue()}</span>
        </Badge>,
      meta: {
        label: 'Status',
        icon: IconListCheck,
        skeletonClassName: 'h-6 w-20',
        filter: {
          type: ColumnFilterType.MultiSelect,
          options: [
            { title: 'Hidden', value: NewsStatus.hidden, icon: IconEyeOff },
            { title: 'Published', value: NewsStatus.published, icon: IconEye }
          ]
        }
      }
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => <span className="text-xs">{format(ctx.getValue(), 'dd.MM.yyyy - HH:mm')}</span>,
      meta: {
        label: 'Created',
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
        label: 'Updated',
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
        label: 'Actions',
        skeletonClassName: 'ml-auto h-7 w-7'
      },
      cell: (ctx) => {
        const navigate = useNavigate();
        const id = ctx.row.getValue<number>('id');
        const slug = ctx.row.getValue<string>('slug');

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger disabled={disabled} asChild>
                <Button size="icon-xs" variant="ghost">
                  <IconDots/>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuLabel>
                  Actions
                </DropdownMenuLabel>

                <DropdownMenuSeparator/>

                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate({ to: '/news/$slug', params: { slug: slug } })}>
                    <span>Go to page</span>
                    <IconLink className="ml-auto size-4"/>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/admin/news/$id/edit" params={{ id: `${id}` }}>
                      <span>Edit</span>
                      <IconPencil className="ml-auto size-4"/>
                    </Link>
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
