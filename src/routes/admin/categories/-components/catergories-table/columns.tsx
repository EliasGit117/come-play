import { createColumnHelper } from '@tanstack/react-table';
import { IAdminCategoryBriefDto } from '@/features/categories/dtos/admin-category-brief-dto';
import { DataTableColumnHeader, ColumnFilterType } from '@/components/data-table';
import { format } from 'date-fns';
import {
  HashIcon,
  HeadingIcon,
  CalendarPlusIcon,
  CalendarClockIcon,
  ListIcon,
  EllipsisIcon,
  PenIcon
} from 'lucide-react';
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
        icon: HashIcon,
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
        icon: HeadingIcon,
        filter: { type: ColumnFilterType.Text, placeholder: 'Search by name' }
      }
    }),

    columnHelper.accessor('slug', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => ctx.getValue(),
      meta: {
        label: 'Slug',
        icon: ListIcon,
        filter: { type: ColumnFilterType.Text, placeholder: 'Search by slug' }
      }
    }),

    columnHelper.accessor('createdAt', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => <span className="text-xs">{format(ctx.getValue(), 'dd.MM.yyyy - HH:mm')}</span>,
      meta: { label: 'Created', icon: CalendarPlusIcon, filter: { type: ColumnFilterType.DateRange } }
    }),

    columnHelper.accessor('updatedAt', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => <span className="text-xs">{format(ctx.getValue(), 'dd.MM.yyyy - HH:mm')}</span>,
      meta: { label: 'Updated', icon: CalendarClockIcon, filter: { type: ColumnFilterType.DateRange } }
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
                <EllipsisIcon/>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <EditCategoryDialogTrigger categoryId={id} withoutStyles asChild>
                <DropdownMenuItem>
                  <span>Edit</span>
                  <PenIcon className="ml-auto size-4"/>
                </DropdownMenuItem>
              </EditCategoryDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    })
  ];
};