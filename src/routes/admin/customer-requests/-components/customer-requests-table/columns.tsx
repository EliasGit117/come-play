import { useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { EmailNotificationStatus } from '@prisma/client';
import {
  IconCalendarPlus,
  IconClock,
  IconDots,
  IconEye,
  IconHash,
  IconMail,
  IconMailbox,
  IconMailCheck,
  IconMailX,
  IconPhone,
  IconUser
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
import { ColumnFilterType, DataTableColumnHeader } from '@/components/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { IAdminCustomerRequestDto } from '@/features/customer-requests/dtos/admin-customer-request-dto';
import { ViewRequestDialog } from '@/routes/admin/customer-requests/-components/view-request-dialog';


const columnHelper = createColumnHelper<IAdminCustomerRequestDto>();

const statusMeta: Record<EmailNotificationStatus, { label: string; icon: typeof IconClock }> = {
  [EmailNotificationStatus.pending]: { label: 'Pending', icon: IconClock },
  [EmailNotificationStatus.sent]: { label: 'Sent', icon: IconMailCheck },
  [EmailNotificationStatus.failed]: { label: 'Failed', icon: IconMailX },
};

interface ICustomerRequestsColumnsOptions {
  disabled?: boolean;
}

export const customerRequestsColumns = (options?: ICustomerRequestsColumnsOptions) => {
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
    columnHelper.accessor('firstName', {
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => <span>{ctx.row.original.firstName} {ctx.row.original.lastName}</span>,
      meta: {
        label: 'Name',
        key: 'name',
        icon: IconUser,
        skeletonClassName: 'h-6 w-40',
        filter: {
          type: ColumnFilterType.Text,
          placeholder: 'Search by name'
        }
      }
    }),
    columnHelper.accessor('email', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => ctx.getValue(),
      meta: {
        label: 'Email',
        icon: IconMail,
        skeletonClassName: 'h-6 w-44',
        filter: { type: ColumnFilterType.Text, placeholder: 'Search by email' }
      }
    }),
    columnHelper.accessor('phone', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => ctx.getValue(),
      meta: {
        label: 'Phone',
        icon: IconPhone,
        skeletonClassName: 'h-6 w-32',
        filter: { type: ColumnFilterType.Text, placeholder: 'Search by phone' }
      }
    }),
    columnHelper.accessor('emailNotificationStatus', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ({ getValue }) => {
        const value = getValue();
        const meta = statusMeta[value];
        const Icon = meta.icon;
        return (
          <Badge variant="outline" className="gap-2 py-1 px-2 m-0">
            <Icon className="size-3.5 text-muted-foreground"/>
            <span>{meta.label}</span>
          </Badge>
        );
      },
      meta: {
        label: 'Notification',
        icon: IconMailbox,
        skeletonClassName: 'h-6 w-24',
        filter: {
          type: ColumnFilterType.MultiSelect,
          options: [
            { title: statusMeta.pending.label, value: EmailNotificationStatus.pending, icon: IconClock },
            { title: statusMeta.sent.label, value: EmailNotificationStatus.sent, icon: IconMailCheck },
            { title: statusMeta.failed.label, value: EmailNotificationStatus.failed, icon: IconMailX }
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
    columnHelper.display({
      id: 'actions',
      size: 44,
      meta: {
        label: 'Actions',
        skeletonClassName: 'ml-auto h-7 w-7'
      },
      cell: (ctx) => {
        const [open, setOpen] = useState(false);
        const request = ctx.row.original;

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
                  <DropdownMenuItem onSelect={() => setOpen(true)}>
                    <span>View</span>
                    <IconEye className="ml-auto size-4"/>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <ViewRequestDialog request={request} open={open} onOpenChange={setOpen}/>
          </div>
        );
      }
    })
  ]);
};
