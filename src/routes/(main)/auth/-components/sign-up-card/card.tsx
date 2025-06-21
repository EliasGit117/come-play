import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FC } from 'react';
import { CheckIcon, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { LoadingButton } from '@/components/ui/loading-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import RegistrationForm, { registrationFormSchema, TRegistrationForm } from './form';
import { useRouter } from '@tanstack/react-router';

interface IProps {
  className?: string;
}

const SignUpCard: FC<IProps> = ({ className }) => {
  const router = useRouter();
  const form = useForm<TRegistrationForm>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: ''
    }
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (params: { fullName: string, email: string, password: string }) => authClient.signUp.email({
      name: params.fullName,
      email: params.email,
      password: params.password
    }),
    onSuccess: (res) => {
      if (res.error) {
        toast.error('Error', { description: res.error.message });
        return;
      }

      router.navigate({ to: '/admin', replace: true });
    },
    onError: (error) => {
      toast.error(error.name, { description: error.message });
    }
  });


  const onSubmit = (values: TRegistrationForm) => {
    return mutateAsync(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('max-w-sm', className)}>
        <Card>
          <CardHeader>
            <div className="flex gap-2">
              <CardTitle className="flex gap-2">
                <UserPlus className="size-4"/>
                <span>Registration</span>
              </CardTitle>
            </div>
            <CardDescription>
              Get started with your new account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <RegistrationForm disabled={isPending}/>
          </CardContent>

          <CardFooter className="justify-end">
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


export default SignUpCard;
