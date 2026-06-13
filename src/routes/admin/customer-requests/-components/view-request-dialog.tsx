import { FC } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { IAdminCustomerRequestDto } from '@/features/customer-requests/dtos/admin-customer-request-dto';
import { ScrollArea } from '@/components/ui/scroll-area';


interface IProps {
  request?: IAdminCustomerRequestDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Row: FC<{ label: string; value?: string | null }> = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-2 py-2 border-b border-border/50 last:border-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="col-span-2 text-sm break-words">{value || '—'}</span>
  </div>
);

export const ViewRequestDialog: FC<IProps> = ({ request, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Customer Request #{request?.id}</DialogTitle>
          <DialogDescription>
            Submitted request details.
          </DialogDescription>
        </DialogHeader>

        {request && (
          <ScrollArea className="max-h-[60vh] pr-4">
            <Row label="First name" value={request.firstName}/>
            <Row label="Last name" value={request.lastName}/>
            <Row label="Phone" value={request.phone}/>
            <Row label="Email" value={request.email}/>
            <Row label="Notification" value={request.emailNotificationStatus}/>
            <Row label="Created" value={format(request.createdAt, 'dd.MM.yyyy - HH:mm')}/>
            <Row label="Message" value={request.message}/>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};
