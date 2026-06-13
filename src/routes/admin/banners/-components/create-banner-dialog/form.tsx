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
import { m } from '@/paraglide/messages';

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
              <FieldLabel htmlFor="title-input">{m['pages.admin.banners.form.title']()}</FieldLabel>
              <Input {...field} id="title-input" placeholder={m['pages.admin.banners.form.titlePlaceholder']()} />
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
              <FieldLabel htmlFor="path-input">{m['pages.admin.banners.form.path']()}</FieldLabel>
              <Input
                {...field}
                id="path-input"
                placeholder={m['pages.admin.banners.form.pathPlaceholderCreate']()}
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
              <FieldLabel>{m['pages.admin.shared.fields.titleRo']()}</FieldLabel>
              <Input {...field} placeholder={m['pages.admin.banners.form.titleRoPlaceholder']()} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="titleRu"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{m['pages.admin.shared.fields.titleRu']()}</FieldLabel>
              <Input {...field} placeholder={m['pages.admin.banners.form.titleRuPlaceholder']()} />
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
              <FieldLabel>{m['pages.admin.banners.form.textRo']()}</FieldLabel>
              <Textarea {...field} placeholder={m['pages.admin.banners.form.textRoPlaceholder']()} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="textRu"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{m['pages.admin.banners.form.textRu']()}</FieldLabel>
              <Textarea {...field} placeholder={m['pages.admin.banners.form.textRuPlaceholder']()} />
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
                  {m['pages.admin.banners.form.isActive']()}
                </FieldLabel>
                <FieldDescription>
                  {m['pages.admin.banners.form.isActiveDescription']()}
                </FieldDescription>
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>
    </fieldset>
  );
};