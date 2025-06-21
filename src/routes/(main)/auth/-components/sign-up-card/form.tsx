import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/password-input';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import z from 'zod';
import { Input } from '@/components/ui/input';


export const registrationFormSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(3).max(256),
  password: z.string().min(3).max(128),
});

export type TRegistrationForm = z.infer<typeof registrationFormSchema>;

interface IProps {
  disabled?: boolean;
  className?: string;
}

const RegistrationForm: FC<IProps> = ({ className, disabled }) => {
  const form = useFormContext<TRegistrationForm>();

  return (
    <fieldset disabled={disabled} className={cn('space-y-4', className)}>
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your full name" {...field}/>
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
              <Input placeholder="Enter your email" {...field}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <PasswordInput placeholder="Enter your password" {...field}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />
    </fieldset>
  );
};

export default RegistrationForm;
