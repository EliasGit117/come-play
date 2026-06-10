import { createColumnHelper } from '@tanstack/react-table';
import { IAdminCategoryBriefDto } from '@/features/categories/dtos/admin-category-brief-dto';
import { DataTableColumnHeader, ColumnFilterType } from '@/components/data-table';
import { format } from 'date-fns';
import {
  IconHash,
  IconHeading,
  IconCalendarPlus,
  IconCalendarClock,
  IconList,
  IconDots,
  IconPencil,
  IconInfoCircle, IconTags
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { EditCategoryDialogTrigger } from '@/routes/admin/categories/-components/edit-category-dialog';
import { Badge } from '@/components/ui/badge';
import { Link } from '@tanstack/react-router';


const columnHelper = createColumnHelper<IAdminCategoryBriefDto>();

export const categoryColumns = (options?: { disabled?: boolean }) => {
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
      meta: { label: 'Select' }
    }),

    columnHelper.accessor('id', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => ctx.getValue(),
      meta: {
        label: 'Id',
        key: 'idRange',
        icon: IconHash,
        filter: { type: ColumnFilterType.NumberRange, min: 1, max: 9999 }
      }
    }),

    columnHelper.accessor('nameRo', {
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => ctx.getValue(),
      meta: {
        key: 'name',
        label: 'Name',
        icon: IconHeading,
        filter: { type: ColumnFilterType.Text, placeholder: 'Search by name' }
      }
    }),

    columnHelper.accessor('slug', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => ctx.getValue(),
      meta: {
        label: 'Slug',
        icon: IconList,
        filter: { type: ColumnFilterType.Text, placeholder: 'Search by slug' }
      }
    }),

    columnHelper.accessor('createdAt', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => <span className="text-xs">{format(ctx.getValue(), 'dd.MM.yyyy - HH:mm')}</span>,
      meta: { label: 'Created', icon: IconCalendarPlus, filter: { type: ColumnFilterType.DateRange } }
    }),

    columnHelper.accessor('updatedAt', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => <span className="text-xs">{format(ctx.getValue(), 'dd.MM.yyyy - HH:mm')}</span>,
      meta: { label: 'Updated', icon: IconCalendarClock, filter: { type: ColumnFilterType.DateRange } }
    }),

    columnHelper.accessor('subcategoriesCount', {
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ({ getValue, row }) => {
        const count = getValue();
        const hasChildren = !!count && count > 0;
        let text: string;

        if (!hasChildren) {
          text = 'None';
        } else if (count === 1) {
          text = '1 child';
        } else {
          text = `${count} children`;
        }

        return (<Link to="/admin/subcategories" disabled={!hasChildren} search={{ categoryName: row.original.nameRo }}>
            <Badge variant='outline' className="gap-2 py-1 px-2 m-0">
              {hasChildren && <IconTags/>}
              <span>{text}</span>
            </Badge>
          </Link>
        );
      },
      meta: {
        label: 'Info',
        icon: IconInfoCircle
      }
    }),

    columnHelper.display({
      id: 'actions',
      size: 44,
      meta: { label: 'Actions' },
      cell: (ctx) => {
        const id = ctx.row.getValue<number>('id');

        return (
          <DropdownMenu>
            <DropdownMenuTrigger disabled={disabled} asChild>
              <Button size="icon-xs" variant="ghost">
                <IconDots/>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <EditCategoryDialogTrigger categoryId={id} withoutStyles asChild>
                <DropdownMenuItem>
                  <span>Edit</span>
                  <IconPencil className="ml-auto size-4"/>
                </DropdownMenuItem>
              </EditCategoryDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    })
  ];
};