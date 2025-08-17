import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
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

export const newsDataTableColumns: ColumnDef<NewsBriefDto>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
    meta: {
      label: 'Id range',
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
    cell: () => {

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
              <DropdownMenuItem>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="!text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
  }
];
