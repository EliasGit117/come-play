import { createColumnHelper } from '@tanstack/react-table';
import { IAdminProductBriefDto } from '@/features/products/dtos/admin-product-brief-dto';
import { format } from 'date-fns';
import {
  IconCalendarClock,
  IconCalendarPlus,
  IconCheck,
  IconDots,
  IconEyeOff,
  IconHash,
  IconHeading,
  IconPhoto,
  IconPhotoOff,
  IconLink,
  IconPencil,
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

const columnHelper = createColumnHelper<IAdminProductBriefDto>();

interface IProductColumnsOptions {
  disabled?: boolean;
}

export const productColumns = (options?: IProductColumnsOptions) => {
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
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
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
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: (ctx) => ctx.getValue(),
      meta: {
        label: 'Id',
        key: 'idRange',
        icon: IconHash,
        skeletonClassName: 'h-6 w-8',
        filter: {
          type: ColumnFilterType.NumberRange,
          min: 1,
          max: 10000
        }
      }
    }),
    columnHelper.accessor((row) => row, {
      id: 'images',
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: (ctx) => {
        const { images } = ctx.row.original;
        const firstImage = images?.[0];

        if (!firstImage) {
          return (
            <div
              className="w-20 h-16 rounded-sm bg-muted text-muted-foreground/50 border justify-center items-center flex"
              title="No image"
            >
              <IconPhotoOff className="size-5" />
            </div>
          );
        }

        return (
          <figure
            className="w-20 h-16 rounded-sm overflow-hidden border border-border/50 bg-muted"
            title="Product image"
          >
            <UnLazyImageSSR
              src={firstImage.url}
              thumbhash={firstImage.thumbhash}
              className="w-full h-full object-cover"
              alt="Product"
            />
          </figure>
        );
      },
      meta: {
        label: 'Image',
        icon: IconPhoto,
        skeletonItem: <Skeleton className="w-20 h-16" />
      }
    }),
    columnHelper.accessor('nameRo', {
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: (ctx) => <p className="text-xs font-medium">{ctx.getValue()}</p>,
      meta: {
        label: 'Name',
        icon: IconHeading,
        skeletonClassName: 'h-6 w-32',
        filter: {
          type: ColumnFilterType.Text,
          placeholder: 'Search by name'
        }
      }
    }),
    columnHelper.accessor('slug', {
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: (ctx) => <p className="text-xs italic">{ctx.getValue()}</p>,
      meta: {
        label: 'Slug',
        icon: IconLink,
        skeletonClassName: 'h-6 w-32',
        filter: {
          type: ColumnFilterType.Text,
          placeholder: 'Search by slug'
        }
      }
    }),
    columnHelper.accessor('hidden', {
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: ({ getValue }) => (
        <Badge variant="outline" className="gap-2 py-1 px-2 m-0">
          {getValue() ? (
            <IconEyeOff className="size-3.5" />
          ) : (
            <IconCheck className="size-3.5" />
          )}
          <span>{getValue() ? 'Hidden' : 'Visible'}</span>
        </Badge>
      ),
      meta: {
        label: 'Visibility',
        icon: IconEyeOff,
        skeletonClassName: 'h-6 w-20',
        filter: {
          type: ColumnFilterType.Select,
          options: [
            { title: 'Visible', value: false, icon: IconCheck },
            { title: 'Hidden', value: true, icon: IconEyeOff }
          ]
        }
      }
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: (ctx) => (
        <span className="text-xs">
          {format(ctx.getValue(), 'dd.MM.yyyy - HH:mm')}
        </span>
      ),
      meta: {
        label: 'Created',
        icon: IconCalendarPlus,
        skeletonClassName: 'h-6 w-26',
        filter: {
          type: ColumnFilterType.DateRange
        }
      }
    }),
    columnHelper.accessor('updatedAt', {
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: (ctx) => (
        <span className="text-xs">
          {format(ctx.getValue(), 'dd.MM.yyyy - HH:mm')}
        </span>
      ),
      meta: {
        label: 'Updated',
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
        label: 'Actions',
        skeletonClassName: 'h-7 w-7 ml-auto'
      },
      cell: (ctx) => {
        const navigate = useNavigate();
        const id = ctx.row.getValue<number>('id');
        const slug = ctx.row.getValue<string>('slug');

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon-xs" variant="ghost">
                  <IconDots />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => navigate({ to: `/products/${slug}` })}
                  >
                    <span>View product</span>
                    <IconLink className="ml-auto size-4" />
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/products/$id/edit" params={{ id: `${id}` }}>
                      <span>Edit</span>
                      <IconPencil className="ml-auto size-4" />
                    </Link>
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