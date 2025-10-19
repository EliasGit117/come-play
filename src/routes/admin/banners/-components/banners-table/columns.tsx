import { createColumnHelper } from '@tanstack/react-table';
import { IAdminBannerBriefDto } from '@/features/banners/dtos/admin-banner-brief-dto';
import { format } from 'date-fns';
import {
  CalendarClockIcon,
  CalendarPlusIcon,
  CheckIcon,
  EllipsisIcon,
  HashIcon,
  HeadingIcon,
  ImageIcon,
  ImageOffIcon,
  LinkIcon,
  ListOrderedIcon,
  MonitorIcon,
  PenIcon,
  SmartphoneIcon,
  TabletIcon,
  TrashIcon,
  XIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  ColumnFilterType,
  DataTableColumnHeader
} from '@/components/data-table';
import { Link, useNavigate } from '@tanstack/react-router';
import { useDeleteBannerAlertDialog } from '@/routes/admin/banners/-components/delete-banner-alert-dialog/provider';
import UnLazyImageSSR from '@/components/un-lazy-image-ssr';

const columnHelper = createColumnHelper<IAdminBannerBriefDto>();

export const bannerColumns = [
  columnHelper.accessor('id', {
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: (ctx) => ctx.getValue(),
    meta: {
      label: 'Id',
      key: 'idRange',
      icon: HashIcon,
      filter: {
        type: ColumnFilterType.NumberRange,
        min: 1,
        max: 5000
      }
    }
  }),
  columnHelper.accessor('desktopImage', {
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: (ctx) => {
      const img = ctx.getValue();

      if (!img)
        return (
          <div className="h-10 aspect-video rounded-sm bg-muted text-muted-foreground/50 border justify-center items-center flex">
            <ImageOffIcon className="size-5" />
          </div>
        );

      return (
        <figure className="h-10 aspect-video rounded-sm overflow-hidden border border-border/50 bg-muted">
          <UnLazyImageSSR
            src={img.url}
            thumbhash={img.thumbhash}
            className="w-full h-full object-cover"
            alt="Desktop banner"
          />
        </figure>
      );
    },
    meta: {
      label: 'Desktop',
      key: 'hasDesktopImage',
      icon: MonitorIcon,
      filter: {
        type: ColumnFilterType.Select,
        options: [
          { title: 'Yes', value: true, icon: ImageIcon },
          { title: 'No', value: false, icon: ImageOffIcon }
        ]
      }
    }
  }),
  columnHelper.accessor('tabletImage', {
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: (ctx) => {
      const img = ctx.getValue();

      if (!img)
        return (
          <div className="h-10 aspect-video rounded-sm bg-muted text-muted-foreground/50 border justify-center items-center flex">
            <ImageOffIcon className="size-5" />
          </div>
        );

      return (
        <figure className="h-10 aspect-video rounded-sm overflow-hidden border border-border/50 bg-muted">
          <UnLazyImageSSR
            src={img.url}
            thumbhash={img.thumbhash}
            className="w-full h-full object-cover"
            alt="Tablet banner"
          />
        </figure>
      );
    },
    meta: {
      label: 'Tablet',
      key: 'hasTabletImage',
      icon: TabletIcon,
      filter: {
        type: ColumnFilterType.Select,
        options: [
          { title: 'Yes', value: true, icon: ImageIcon },
          { title: 'No', value: false, icon: ImageOffIcon }
        ]
      }
    }
  }),
  columnHelper.accessor('mobileImage', {
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: (ctx) => {
      const img = ctx.getValue();

      if (!img)
        return (
          <div className="h-10 aspect-video rounded-sm bg-muted text-muted-foreground/50 border justify-center items-center flex">
            <ImageOffIcon className="size-5" />
          </div>
        );

      return (
        <figure className="h-10 aspect-video rounded-sm overflow-hidden border border-border/50 bg-muted">
          <UnLazyImageSSR
            src={img.url}
            thumbhash={img.thumbhash}
            className="w-full h-full object-cover"
            alt="Mobile banner"
          />
        </figure>
      );
    },
    meta: {
      label: 'Mobile',
      key: 'hasMobileImage',
      icon: SmartphoneIcon,
      filter: {
        type: ColumnFilterType.Select,
        options: [
          { title: 'Yes', value: true, icon: ImageIcon },
          { title: 'No', value: false, icon: ImageOffIcon }
        ]
      }
    }
  }),
  columnHelper.accessor('title', {
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: (ctx) => ctx.getValue(),
    meta: {
      label: 'Title',
      icon: HeadingIcon,
      filter: {
        type: ColumnFilterType.Text,
        placeholder: 'Search by title'
      }
    }
  }),
  columnHelper.accessor('path', {
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: (ctx) => ctx.getValue() || '-',
    meta: {
      label: 'Path',
      icon: LinkIcon,
      filter: {
        type: ColumnFilterType.Text,
        placeholder: 'Search by path'
      }
    }
  }),
  columnHelper.accessor('order', {
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: (ctx) => ctx.getValue(),
    meta: {
      label: 'Order',
      icon: ListOrderedIcon
    }
  }),
  columnHelper.accessor('isActive', {
    header: ({ column }) => <DataTableColumnHeader column={column} />,
    cell: ({ getValue }) => (
      <Badge variant="outline" className="gap-2 py-1 px-2 m-0">
        {getValue() ? (
          <CheckIcon className="size-3.5" />
        ) : (
          <XIcon className="size-3.5" />
        )}
        <span>{getValue() ? 'Active' : 'Inactive'}</span>
      </Badge>
    ),
    meta: {
      label: 'Is active',
      icon: CheckIcon,
      filter: {
        type: ColumnFilterType.Select,
        options: [
          { title: 'Active', value: true, icon: CheckIcon },
          { title: 'Inactive', value: false, icon: XIcon }
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
      icon: CalendarPlusIcon,
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
      icon: CalendarClockIcon,
      filter: {
        type: ColumnFilterType.DateRange
      }
    }
  }),
  columnHelper.display({
    id: 'actions',
    meta: { label: 'Actions' },
    cell: (ctx) => {
      const navigate = useNavigate();
      const { setId } = useDeleteBannerAlertDialog();
      const id = ctx.row.getValue<number>('id');
      const path = ctx.row.getValue<string | null>('path');

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger className="" asChild>
              <Button size="icon-xs" variant="ghost">
                <EllipsisIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuGroup>
                {path && (
                  <DropdownMenuItem
                    onClick={() => navigate({ to: path })}
                  >
                    <span>Go to page</span>
                    <LinkIcon className="ml-auto size-4" />
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem asChild>
                  <Link to="/admin/banners/$id/edit" params={{ id: `${id}` }}>
                    <span>Edit</span>
                    <PenIcon className="ml-auto size-4" />
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setId(id)}
                >
                  <span>Delete</span>
                  <TrashIcon className="ml-auto size-4" />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
  })
];