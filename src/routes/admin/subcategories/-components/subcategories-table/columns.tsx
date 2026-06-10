import { createColumnHelper } from '@tanstack/react-table';
import { IAdminSubcategoryBriefDto } from '@/features/subcategories/dtos/admin-subcategory-brief-dto';
import { DataTableColumnHeader, ColumnFilterType } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import {
  IconCalendarClock,
  IconCalendarPlus,
  IconDots,
  IconHash,
  IconHeading,
  IconList,
  IconPencil,
  IconStack2
} from '@tabler/icons-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { EditSubcategoryDialogTrigger } from '@/routes/admin/subcategories/-components/edit-subcategory-dialog';


const columnHelper = createColumnHelper<IAdminSubcategoryBriefDto>();

export const subcategoryColumns = (options?: { disabled?: boolean }) => {
  const { disabled } = options ?? {};

  return [
    columnHelper.display({
      id: 'select',
      size: 32,
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
    }),

    columnHelper.accessor('id', {
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: (ctx) => ctx.getValue(),
      meta: {
        label: 'Id',
        icon: IconHash,
        filter: { type: ColumnFilterType.NumberRange },
      },
    }),

    columnHelper.accessor('nameRo', {
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: (ctx) => ctx.getValue(),
      meta: {
        key: 'name',
        label: 'Name',
        icon: IconHeading,
        filter: { type: ColumnFilterType.Text },
      },
    }),

    columnHelper.accessor('slug', {
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: (ctx) => ctx.getValue(),
      meta: {
        label: 'Slug',
        icon: IconList,
        filter: { type: ColumnFilterType.Text },
      },
    }),

    columnHelper.accessor(row => row.category?.nameRo, {
      id: 'categoryName',
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: (ctx) => ctx.getValue() ?? '-',
      enableSorting: false,
      meta: {
        label: 'Category',
        icon: IconStack2,
        filter: { type: ColumnFilterType.Text, placeholder: 'Category name' },
      },
    }),

    columnHelper.accessor('createdAt', {
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: (ctx) => <span>{format(ctx.getValue(), 'dd.MM.yyyy - HH:mm')}</span>,
      meta: { label: 'Created', icon: IconCalendarPlus },
    }),

    columnHelper.accessor('updatedAt', {
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: (ctx) => <span>{format(ctx.getValue(), 'dd.MM.yyyy - HH:mm')}</span>,
      meta: { label: 'Updated', icon: IconCalendarClock },
    }),

    columnHelper.display({
      id: 'actions',
      size: 44,
      cell: (ctx) => {
        const id = ctx.row.original.id;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger disabled={disabled} asChild>
              <Button variant="ghost" size="icon-xs">
                <IconDots />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <EditSubcategoryDialogTrigger subcategoryId={id} withoutStyles asChild>
                <DropdownMenuItem>
                  <span>Edit</span>
                  <IconPencil className="ml-auto size-4" />
                </DropdownMenuItem>
              </EditSubcategoryDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];
};