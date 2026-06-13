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
  IconTrash,
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
import { useConfirm } from '@/components/ui/confirm-dialog';
import { orpc } from '@/lib/orpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { m } from '@/paraglide/messages';


const columnHelper = createColumnHelper<IAdminCustomerRequestDto>();

const statusMeta: Record<EmailNotificationStatus, { label: string; icon: typeof IconClock }> = {
  [EmailNotificationStatus.pending]: { label: m['pages.admin.customerRequests.table.status.pending'](), icon: IconClock },
  [EmailNotificationStatus.sent]: { label: m['pages.admin.customerRequests.table.status.sent'](), icon: IconMailCheck },
  [EmailNotificationStatus.failed]: { label: m['pages.admin.customerRequests.table.status.failed'](), icon: IconMailX },
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
        label: m['pages.admin.shared.table.select'](),
        skeletonClassName: 'w-6 h-6'
      }
    }),
    columnHelper.accessor('id', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => ctx.getValue(),
      meta: {
        label: m['pages.admin.shared.table.id'](),
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
        label: m['pages.admin.customerRequests.table.columns.name'](),
        key: 'name',
        icon: IconUser,
        skeletonClassName: 'h-6 w-40',
        filter: {
          type: ColumnFilterType.Text,
          placeholder: m['pages.admin.customerRequests.table.filters.searchByName']()
        }
      }
    }),
    columnHelper.accessor('email', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => ctx.getValue(),
      meta: {
        label: m['pages.admin.customerRequests.table.columns.email'](),
        icon: IconMail,
        skeletonClassName: 'h-6 w-44',
        filter: { type: ColumnFilterType.Text, placeholder: m['pages.admin.customerRequests.table.filters.searchByEmail']() }
      }
    }),
    columnHelper.accessor('phone', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ctx => ctx.getValue(),
      meta: {
        label: m['pages.admin.customerRequests.table.columns.phone'](),
        icon: IconPhone,
        skeletonClassName: 'h-6 w-32',
        filter: { type: ColumnFilterType.Text, placeholder: m['pages.admin.customerRequests.table.filters.searchByPhone']() }
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
        label: m['pages.admin.customerRequests.table.columns.notification'](),
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
        label: m['pages.admin.shared.table.created'](),
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
        label: m['pages.admin.shared.actions.actions'](),
        skeletonClassName: 'ml-auto h-7 w-7'
      },
      cell: (ctx) => {
        const [open, setOpen] = useState(false);
        const confirm = useConfirm();
        const queryClient = useQueryClient();
        const request = ctx.row.original;

        const { isPending: isDeleting, mutateAsync: deleteAsync } = useMutation({
          ...orpc.admin.customerRequests.delete.mutationOptions(),
          onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: orpc.admin.customerRequests.key() });
          }
        });

        const handleDelete = async () => {
          const isConfirmed = await confirm({
            title: m['pages.admin.customerRequests.delete.confirmTitleSingle'](),
            description: m['pages.admin.customerRequests.delete.confirmDescriptionSingle'](),
            confirmText: m['pages.admin.shared.actions.delete'](),
            cancelText: m['common.cancel']()
          });

          if (!isConfirmed)
            return;

          toast.promise(deleteAsync({ id: request.id }), {
            loading: m['pages.admin.customerRequests.delete.loadingToastSingle'](),
            success: m['pages.admin.customerRequests.delete.successToastSingle'](),
            error: (err) => err instanceof Error ? err.message : m['pages.admin.customerRequests.delete.errorToastSingle']()
          });
        };

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger disabled={disabled || isDeleting} asChild>
                <Button size="icon-xs" variant="ghost">
                  <IconDots/>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuLabel>
                  {m['pages.admin.shared.actions.actions']()}
                </DropdownMenuLabel>

                <DropdownMenuSeparator/>

                <DropdownMenuGroup>
                  <DropdownMenuItem onSelect={() => setOpen(true)}>
                    <span>{m['pages.admin.shared.actions.view']()}</span>
                    <IconEye className="ml-auto size-4"/>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator/>

                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                    <span>{m['pages.admin.shared.actions.delete']()}</span>
                    <IconTrash className="ml-auto size-4"/>
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
