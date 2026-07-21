import { z } from 'zod';
import { type ComponentProps, type FC, useState } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { Checkbox } from '@/components/ui/checkbox';
import { m } from '@/paraglide/messages';

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  rememberMe: z.boolean(),
});

export type TSignInSchema = z.infer<typeof signInSchema>;

interface IProps extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  id?: string;
  form: UseFormReturn<TSignInSchema>;
  onSubmit: (data: TSignInSchema) => void;
  disabled?: boolean;
}

export const SignInForm: FC<IProps> = ({ form, id, onSubmit, disabled, ...props }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <form
      id={id ?? 'sign-in-form'}
      onSubmit={form.handleSubmit(onSubmit)}
      method="post"
      {...props}
    >
      <fieldset disabled={disabled}>
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email-input">{m['pages.auth.signIn.email']()}</FieldLabel>
                <Input
                  {...field}
                  id="email-input"
                  type="email"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="johndoe@yahoo.com"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password-input">{m['pages.auth.signIn.password']()}</FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id="password-input"
                    autoComplete="current-password"
                    type={isPasswordVisible ? 'text' : 'password'}
                    aria-invalid={fieldState.invalid}
                    placeholder="*********"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      type="button"
                      aria-label={m['pages.auth.signIn.showPassword']()}
                      title={m['pages.auth.signIn.showPassword']()}
                      onClick={() => setIsPasswordVisible((pv) => !pv)}
                    >
                      {isPasswordVisible ? <IconEye /> : <IconEyeOff />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="rememberMe"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <Checkbox
                  id="remember-me-input"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  disabled={disabled}
                  aria-invalid={fieldState.invalid}
                />
                <FieldLabel htmlFor="remember-me-input" className="font-normal">
                  {m['pages.auth.signIn.rememberMe']()}
                </FieldLabel>
              </Field>
            )}
          />
        </FieldGroup>
      </fieldset>
    </form>
  );
};
