import React, { ComponentProps, FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { LoadingButton } from '@/components/ui/loading-button';
import { SendIcon } from 'lucide-react';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  message: z.string().min(1, 'Message is required')
});

type TContactForm = z.infer<typeof contactSchema>;

interface IProps extends ComponentProps<'form'> {
}

const WriteAMessageForm: FC<IProps> = ({ className, ...props }) => {
  const form = useForm<TContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: ''
    }
  });

  function onSubmit(data: TContactForm) {
    toast('You submitted the following values', {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      )
    });
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
                <FieldLabel htmlFor="first-name-input">First name</FieldLabel>
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
                <FieldLabel htmlFor="last-name-input">Last name</FieldLabel>
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
                <FieldLabel htmlFor="email-input">Email</FieldLabel>
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
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="phone-input">Email</FieldLabel>
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
                <FieldLabel htmlFor="message-text-area">Message</FieldLabel>
                <Textarea
                  {...field}
                  id="message-text-area"
                  aria-invalid={fieldState.invalid}
                  placeholder="Here you can write a message for us"
                  className='min-h-40'
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Field orientation='horizontal' className='col-span-full'>
            <LoadingButton className="w-full md:w-fit md:ml-auto" loading={false} disabled={false}>
              <span>Submit</span>
              <SendIcon/>
            </LoadingButton>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
};

export default WriteAMessageForm;