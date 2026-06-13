import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import { TCreateNewsSchema } from '@/features/news/schemas/create-news';
import { m } from '@/paraglide/messages';


export interface IPostProps {
  disabled?: boolean;
  className?: string;
}

export const NewsForm: FC<IPostProps> = ({ className, disabled }) => {
  const form = useFormContext<TCreateNewsSchema>();

  return (
    <fieldset disabled={disabled} className={className}>
      <FieldGroup>
        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="slug-input">{m['pages.admin.shared.fields.slug']()}</FieldLabel>
              <Input
                {...field}
                id="slug-input"
                aria-invalid={fieldState.invalid}
                placeholder={m['pages.admin.shared.fields.slugPlaceholder']()}
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]}/>
              )}
            </Field>
          )}
        />

        <Controller
          name="titleRo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title-ro-input">{m['pages.admin.shared.fields.titleRo']()}</FieldLabel>
              <Input
                {...field}
                id="title-ro-input"
                aria-invalid={fieldState.invalid}
                placeholder={m['pages.admin.news.form.titleRoPlaceholder']()}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
            </Field>
          )}
        />

        <Controller
          name="titleRu"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title-ru-input">{m['pages.admin.shared.fields.titleRu']()}</FieldLabel>
              <Input
                {...field}
                id="title-ru-input"
                aria-invalid={fieldState.invalid}
                placeholder={m['pages.admin.news.form.titleRuPlaceholder']()}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
            </Field>
          )}
        />
      </FieldGroup>
    </fieldset>
  );
};

