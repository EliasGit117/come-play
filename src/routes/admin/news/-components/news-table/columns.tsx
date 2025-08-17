import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, TrashIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import * as React from 'react';
import { DataTableColumnHeader } from '@/components/data-table';
import { SearchInputType } from '@/components/data-table/types/filtration';
import { NewsBriefDto } from '@/features/news/dtos/news-brief-dto';
import { format } from 'date-fns';
import { Link } from '@tanstack/react-router';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useDeleteNewsMutation } from '@/features/news/server-functions/delete-news-by-id';

export const newsDataTableColumns: ColumnDef<NewsBriefDto>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
    meta: {
      label: 'Id',
      search: {
        key: 'idRange',
        type: SearchInputType.NumberRange,
        range: [1, 1000]
      }
    },
    filterFn: 'equals'
  },
  {
    accessorKey: 'title',
    meta: {
      label: 'Title',
      search: {
        key: 'title',
        type: SearchInputType.Text,
        placeholder: 'Search by title'
      }
    },
    header: ({ column }) =>
      <DataTableColumnHeader column={column} title="Title"/>,
    cell: ({ row }) => <div className="lowercase">{row.getValue('title')}</div>
  },
  {
    accessorKey: 'link',
    meta: {
      label: 'Link',
      search: {
        key: 'link',
        type: SearchInputType.Text,
        placeholder: 'Search by link'
      }
    },
    header: ({ column }) =>
      <DataTableColumnHeader column={column} title="Link"/>,
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue('link')}
      </div>
    )

  },
  {
    accessorKey: 'createdAt',
    meta: {
      label: 'Created At',
      search: { key: 'createdAt', type: SearchInputType.DateRange }
    },
    header: ({ column }) =>
      <DataTableColumnHeader column={column} title="Created At"/>,
    cell: ({ row }) =>
      <div>{format(row.original.createdAt, 'dd.MM.yyyy - HH:mm')}</div>
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const confirm = useConfirm();
      const { isPending, mutateAsync } = useDeleteNewsMutation();

      const remove = async () => {
        const confirmed = await confirm({
          title: 'Delete Item',
          description: 'Are you sure? This action cannot be undone.',
          icon: <TrashIcon className="size-4 text-destructive"/>,
          confirmText: 'Delete',
          cancelText: 'Cancel',
          confirmButton: {
            className: cn(
              'bg-destructive text-white shadow-xs hover:bg-destructive/90',
              'focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60'
            )
          },
          alertDialogTitle: {
            className: 'flex items-center gap-2'
          }
        });

        if (!confirmed) return;

        toast.promise(() => mutateAsync(row.original.id), {
          loading: 'Deleting...',
          success: () => 'Deleted successfully!',
          error: (err: any) => err?.message || 'Failed to delete'
        });
      };

      return (
        <div className="flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 ml-auto">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link to="/admin/news/$id/edit" params={{ id: `${row.original.id}` }}>
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="!text-destructive" onClick={() => remove()} disabled={isPending}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
  }
];