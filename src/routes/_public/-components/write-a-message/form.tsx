import { IconSend } from '@tabler/icons-react';
import React, { ComponentProps, FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { LoadingButton } from '@/components/ui/loading-button';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { m } from '@/paraglide/messages';
import { orpc } from '@/lib/orpc';
import { useMutation } from '@tanstack/react-query';

const contactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  message: z.string().min(1)
});

type TContactForm = z.infer<typeof contactSchema>;

interface IProps extends ComponentProps<'form'> {
}

const WriteAMessageForm: FC<IProps> = ({ className, ...props }) => {
  const localizedSchema = z.object({
    firstName: z.string().min(1, m['pages.public.home.contact.validation.firstNameRequired']()),
    lastName: z.string().min(1, m['pages.public.home.contact.validation.lastNameRequired']()),
    email: z.string().email(m['pages.public.home.contact.validation.emailInvalid']()),
    phone: z.string().min(1, m['pages.public.home.contact.validation.phoneRequired']()),
    message: z.string().min(1, m['pages.public.home.contact.validation.messageRequired']())
  });

  const form = useForm<TContactForm>({
    resolver: zodResolver(localizedSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: ''
    }
  });

  const { mutate, isPending } = useMutation({
    ...orpc.customerRequests.create.mutationOptions(),
    onError: (e) => toast.error(e.name, { description: e.message }),
    onSuccess: () => {
      form.reset();
      toast.success(m['pages.public.home.contact.success']());
    }
  });

  function onSubmit(data: TContactForm) {
    mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className} {...props}>
        <FieldGroup className="grid md:grid-cols-2 gap-4">
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="first-name-input">{m['pages.public.home.contact.firstName']()}</FieldLabel>
                <Input
                  {...field}
                  id="first-name-input"
                  aria-invalid={fieldState.invalid}
                  placeholder="John"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="last-name-input">{m['pages.public.home.contact.lastName']()}</FieldLabel>
                <Input
                  {...field}
                  id="last-name-input"
                  aria-invalid={fieldState.invalid}
                  placeholder="Doe"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email-input">{m['pages.public.home.contact.email']()}</FieldLabel>
                <Input
                  {...field}
                  id="email-input"
                  aria-invalid={fieldState.invalid}
                  placeholder="johnDoe537@yahoo.com"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="phone-input">{m['pages.public.home.contact.phone']()}</FieldLabel>
                <Input
                  {...field}
                  id="phone-input"
                  aria-invalid={fieldState.invalid}
                  placeholder="+37360000000"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="message"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="col-span-full" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="message-text-area">{m['pages.public.home.contact.message']()}</FieldLabel>
                <Textarea
                  {...field}
                  id="message-text-area"
                  aria-invalid={fieldState.invalid}
                  placeholder={m['pages.public.home.contact.messagePlaceholder']()}
                  className='min-h-40'
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Field orientation='horizontal' className='col-span-full'>
            <LoadingButton loadingText={m['common.loading']()} type="submit" className="w-full md:w-fit md:ml-auto" loading={isPending} disabled={isPending}>
              <IconSend/>
              <span>{m['pages.public.home.contact.submit']()}</span>
            </LoadingButton>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
};

export default WriteAMessageForm;