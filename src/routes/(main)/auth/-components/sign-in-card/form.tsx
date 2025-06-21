
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import z from 'zod';
import { cn } from '@/lib/utils';


export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(128),
  rememberMe: z.boolean()
});

export type TLoginForm = z.infer<typeof loginFormSchema>;

interface IProps {
  disabled?: boolean;
  className?: string;
}

const LoginForm: FC<IProps> = ({ className, disabled }) => {
  const form = useFormContext<TLoginForm>();

  return (
    <fieldset disabled={disabled} className={cn('space-y-4', className)}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Email
            </FormLabel>
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
            <FormLabel>
              Password
            </FormLabel>
            <FormControl>
              <PasswordInput placeholder="Enter your password"{...field}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />
    </fieldset>
  );
};

export default LoginForm;
