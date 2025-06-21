import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FC } from 'react';
import { CheckIcon, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { LoadingButton } from '@/components/ui/loading-button';
import { zodResolver } from '@hookform/resolvers/zod';
import LoginForm, { loginFormSchema, type TLoginForm } from './form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from '@tanstack/react-router';
import { authQueryKeys } from '@/features/auth/queries';

interface IProps {
  className?: string;
}

const SignInCard: FC<IProps> = ({ className }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const form = useForm<TLoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true
    }
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: TLoginForm) => authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe
    }, {}),
    onSuccess: async (data) => {
      if (data.error) {
        toast.error('Error', { description: data.error.message });
        return;
      }

      queryClient.invalidateQueries({ queryKey: authQueryKeys.getUser }).then(() =>
        router.navigate({ to: '/admin', replace: true })
      );
    },
    onError: (error) => {
      toast.error(error.name, { description: error.message });
    }
  });

  const onSubmit = (formValues: TLoginForm) => {
    return mutateAsync(formValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('max-w-sm', className)}>
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2">
              <User className="size-4"/>
              <span>Sign In</span>
            </CardTitle>
            <CardDescription>
              Authenticate to start using the system
            </CardDescription>
          </CardHeader>

          <CardContent>
            <LoginForm disabled={isPending}/>
          </CardContent>

          <CardFooter className="flex gap-4 justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center">
                  <FormControl>
                    <Checkbox
                      disabled={isPending}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Remember me
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <LoadingButton loading={isPending}>
              <CheckIcon/>
              <span>Submit</span>
            </LoadingButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default SignInCard;
