import { createColumnHelper } from '@tanstack/react-table';
import { IAdminNewsBriefDto } from '@/features/news/dtos/admin-news-brief-dto';
import { format } from 'date-fns';
import { NewsStatus } from '@prisma/client';
import {
  CalendarClockIcon,
  CalendarPlusIcon,
  EllipsisIcon,
  EyeIcon,
  EyeOffIcon,
  HashIcon,
  HeadingIcon,
  ImageIcon, ImageOffIcon,
  LinkIcon,
  ListCheckIcon,
  PenIcon,
  TrashIcon
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
import { ColumnFilterType, DataTableColumnHeader } from '@/components/data-table';
import { Link, useNavigate } from '@tanstack/react-router';
import { useDeleteNewsAlertDialog } from '@/routes/admin/news/-components/delete-news-alert-dialog/provider';
import UnLazyImageSSR from '@/components/un-lazy-image-ssr';


const columnHelper = createColumnHelper<IAdminNewsBriefDto>();

export const newsColumns = [
  columnHelper.accessor('id', {
    header: ({ column }) => <DataTableColumnHeader column={column}/>,
    cell: ctx => ctx.getValue(),
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
  columnHelper.accessor('image', {
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column}/>,
    cell: ctx => {
      const img = ctx.getValue();

      if (!img)
        return (
          <div
            className="h-10 aspect-video rounded-sm bg-muted text-muted-foreground/50 border justify-center items-center flex">
            <ImageOffIcon className="size-5"/>
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
      icon: ImageIcon,
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
    header: ({ column }) => <DataTableColumnHeader column={column}/>,
    cell: ctx => ctx.getValue(),
    meta: {
      label: 'Title',
      icon: HeadingIcon,
      filter: {
        type: ColumnFilterType.Text,
        placeholder: 'Search by title'
      }
    }
  }),
  columnHelper.accessor('slug', {
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column}/>,
    cell: ctx => ctx.getValue(),
    meta: {
      label: 'Slug',
      icon: LinkIcon,
      filter: {
        type: ColumnFilterType.Text,
        placeholder: 'Search by slug'
      }
    }
  }),
  columnHelper.accessor('status', {
    header: ({ column }) => <DataTableColumnHeader column={column}/>,
    cell: ({ getValue }) =>
      <Badge variant="outline" className="gap-2 py-1 px-2 m-0">
        {getValue() === NewsStatus.hidden ? (
          <EyeOffIcon className="size-3.5 text-muted-foreground"/>
        ) : (
          <EyeIcon className="size-3.5 text-muted-foreground"/>
        )}
        <span className="capitalize">{getValue()}</span>
      </Badge>,
    meta: {
      label: 'Status',
      icon: ListCheckIcon,
      filter: {
        type: ColumnFilterType.MultiSelect,
        options: [
          { title: 'Hidden', value: NewsStatus.hidden, icon: EyeOffIcon },
          { title: 'Published', value: NewsStatus.published, icon: EyeIcon }
        ]
      }
    }
  }),
  columnHelper.accessor('createdAt', {
    header: ({ column }) => <DataTableColumnHeader column={column}/>,
    cell: ctx => <span className="text-xs">{format(ctx.getValue(), 'dd.MM.yyyy - HH:mm')}</span>,
    meta: {
      label: 'Created',
      icon: CalendarPlusIcon,
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
      const { setId } = useDeleteNewsAlertDialog();
      const id = ctx.row.getValue<number>('id');
      const slug = ctx.row.getValue<string>('slug');

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger className="" asChild>
              <Button size="icon-xs" variant="ghost">
                <EllipsisIcon/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate({ to: '/news/$slug', params: { slug: slug } })}>
                  <span>Go to page</span>
                  <LinkIcon className="ml-auto size-4"/>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/admin/news/$id/edit" params={{ id: `${id}` }}>
                    <span>Edit</span>
                    <PenIcon className="ml-auto size-4"/>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem variant="destructive" onClick={() => setId(id)}>
                  <span>Delete</span>
                  <TrashIcon className="ml-auto size-4"/>
                </DropdownMenuItem>

              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
  })
];
