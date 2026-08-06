import { IconSend } from '@tabler/icons-react';
import { FC, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc';
import { m } from '@/paraglide/messages';
import { usePanelSettingsProvider } from '@/routes/_public/calculator/-providers/panel-settings-provider';
import { PanelType } from '@/routes/_public/calculator/-consts/products';
import { TILE_HEIGHT_CM, TILE_WIDTH_CM } from '@/routes/_public/calculator/-consts/tile';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import { LoadingButton } from '@/components/ui/loading-button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

const panelTypeLabels: Record<PanelType, () => string> = {
  [PanelType.Indoor]: m['pages.public.calculator.panel_types.indoor'],
  [PanelType.Outdoor]: m['pages.public.calculator.panel_types.outdoor'],
};

interface IContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const SendRequestDialog: FC<{ className?: string }> = ({ className }) => {
  const [open, setOpen] = useState(false);

  const { panelType, sight, tilesXCount, tilesYCount } =
    usePanelSettingsProvider(s => ({
      panelType: s.panelType,
      sight: s.sight,
      tilesXCount: s.tilesXCount,
      tilesYCount: s.tilesYCount,
    }));

  const summary = [
    `${m['pages.public.calculator.settings.section_panel_type']()}: ${panelTypeLabels[panelType]()}`,
    `${m['pages.public.calculator.settings.section_screen_size']()}: ${tilesXCount * TILE_WIDTH_CM} x ${tilesYCount * TILE_HEIGHT_CM} cm`,
    `${m['pages.public.calculator.settings.sight_distance_label']()}: ${sight.from} - ${sight.to}`
  ].join('\n');

  const localizedSchema = z.object({
    firstName: z.string().min(1, m['pages.public.home.contact.validation.firstNameRequired']()),
    lastName: z.string().min(1, m['pages.public.home.contact.validation.lastNameRequired']()),
    email: z.string().email(m['pages.public.home.contact.validation.emailInvalid']()),
    phone: z.string().min(1, m['pages.public.home.contact.validation.phoneRequired']())
  });

  const form = useForm<IContactForm>({
    resolver: zodResolver(localizedSchema),
    defaultValues: { firstName: '', lastName: '', email: '', phone: '' }
  });

  const { mutate, isPending } = useMutation({
    ...orpc.customerRequests.create.mutationOptions(),
    onError: (e) => toast.error(e.name, { description: e.message }),
    onSuccess: () => {
      form.reset();
      setOpen(false);
      toast.success(m['pages.public.home.contact.success']());
    }
  });

  function onSubmit(data: IContactForm) {
    mutate({ ...data, message: summary });
  }

  const onOpenChange = (next: boolean) => {
    // Fresh form every time the dialog opens
    if (next) form.reset();
    setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" className={className}>
          <IconSend data-icon="inline-start"/>
          {m['pages.public.calculator.settings.submit']()}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{m['pages.public.calculator.request.title']()}</DialogTitle>
          <DialogDescription>{m['pages.public.calculator.request.description']()}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">{m['pages.public.calculator.request.summary']()}</p>
          <pre className="rounded-md bg-muted p-3 text-sm whitespace-pre-wrap font-sans text-muted-foreground">
            {summary}
          </pre>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="grid gap-4">
              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="request-first-name">
                      {m['pages.public.home.contact.firstName']()}
                    </FieldLabel>
                    <Input {...field} id="request-first-name" aria-invalid={fieldState.invalid}/>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                  </Field>
                )}
              />

              <Controller
                name="lastName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="request-last-name">
                      {m['pages.public.home.contact.lastName']()}
                    </FieldLabel>
                    <Input {...field} id="request-last-name" aria-invalid={fieldState.invalid}/>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="request-email">
                      {m['pages.public.home.contact.email']()}
                    </FieldLabel>
                    <Input {...field} id="request-email" aria-invalid={fieldState.invalid}/>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                  </Field>
                )}
              />

              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="request-phone">
                      {m['pages.public.home.contact.phone']()}
                    </FieldLabel>
                    <Input {...field} id="request-phone" aria-invalid={fieldState.invalid}/>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                  </Field>
                )}
              />

              <Field>
                <LoadingButton loadingText={m['common.loading']()} type="submit" className="w-full" loading={isPending} disabled={isPending}>
                  <IconSend/>
                  <span>{m['pages.public.calculator.settings.submit']()}</span>
                </LoadingButton>
              </Field>
            </FieldGroup>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SendRequestDialog;
