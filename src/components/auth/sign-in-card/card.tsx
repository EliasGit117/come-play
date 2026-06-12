import type { ComponentProps, FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IconSend } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { SignInForm, signInSchema, type TSignInSchema } from './form';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@/components/ui/loading-button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { orpc } from '@/lib/orpc';
import { authClient } from '@/lib/auth/better-auth-client';

interface ISignInCard extends ComponentProps<typeof Card> {
  redirectTo?: string;
}

export const SignInCard: FC<ISignInCard> = ({ className, redirectTo = '/admin', ...props }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<TSignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '', rememberMe: true },
  });

  const { mutate: signIn, isPending } = useMutation({
    mutationFn: ({ email, password, rememberMe }: TSignInSchema) =>
      authClient.signIn.email({ email, password, rememberMe }),
    onSuccess: async (res) => {
      if (res.error)
        throw new Error(res.error.message);

      await queryClient.invalidateQueries({ queryKey: orpc.sessions.current.queryKey() });
      await navigate({ to: redirectTo });
    },
    onError: (e) => {
      toast.error('Sign in failed', { description: e.message });
    },
  });

  return (
    <Card className={cn('w-full max-w-sm', className)} {...props}>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your credentials to access the admin panel.</CardDescription>
      </CardHeader>

      <CardContent>
        <SignInForm form={form} onSubmit={signIn} disabled={isPending} id="sign-in-form" />
      </CardContent>

      <CardFooter className="flex-col gap-4">
        <LoadingButton className="w-full" loading={isPending} form="sign-in-form">
          <IconSend />
          <span>Submit</span>
        </LoadingButton>
      </CardFooter>
    </Card>
  );
};
