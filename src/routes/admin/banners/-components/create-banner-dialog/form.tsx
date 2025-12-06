import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Field, FieldContent, FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import { TCreateBannerSchema } from '@/features/banners/schemas/create-banner';
import { Checkbox } from '@/components/ui/checkbox';

interface IBannerFormProps {
  disabled?: boolean;
  className?: string;
}

export const BannerForm: FC<IBannerFormProps> = ({ disabled, className }) => {
  const form = useFormContext<TCreateBannerSchema>();

  return (
    <fieldset disabled={disabled} className={className}>
      <FieldGroup className="grid grid-cols-1 sm:grid-cols-2">
        {/** Title */}
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title-input">Title</FieldLabel>
              <Input {...field} id="title-input" placeholder="Banner title" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/** Path */}
        <Controller
          name="path"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="path-input">Path</FieldLabel>
              <Input
                {...field}
                id="path-input"
                placeholder="some-path-for-banner"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/** Romanian + Russian Titles */}
        <Controller
          name="titleRo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Romanian title</FieldLabel>
              <Input {...field} placeholder="Denumirea bannerului" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="titleRu"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Russian title</FieldLabel>
              <Input {...field} placeholder="Название баннера" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/** Text fields */}
        <Controller
          name="textRo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Romanian text</FieldLabel>
              <Textarea {...field} placeholder="Descriere" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="textRu"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Russian text</FieldLabel>
              <Textarea {...field} placeholder="Описание" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="isActive"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <Checkbox
                id="is-active-checkbox"
                checked={field.value ?? false}
                onCheckedChange={(value) => field.onChange(value)}
                aria-invalid={fieldState.invalid}
              />
              <FieldContent>
                <FieldLabel htmlFor="is-active-checkbox">
                  Is active
                </FieldLabel>
                <FieldDescription>
                  Controls visibility of the banner
                </FieldDescription>
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>
    </fieldset>
  );
};