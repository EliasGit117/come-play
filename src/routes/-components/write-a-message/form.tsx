import React, { ComponentProps, FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  country: z.string().min(1, 'Country is required'),
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
      name: '',
      country: '',
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
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('grid md:grid-cols-2 gap-4', className)} {...props}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Textarea className="min-h-44" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <div className="flex col-span-full">
          <Button type="submit" className="w-full md:w-fit md:ml-auto">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WriteAMessageForm;