import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { TCreateCategorySchema } from '@/features/categories/schemas/create-category';


interface IBannerFormProps {
  disabled?: boolean;
  className?: string;
}

export const BannerForm: FC<IBannerFormProps> = ({ disabled, className }) => {
  const form = useFormContext<TCreateCategorySchema>();

  return (
    <fieldset disabled={disabled} className={className}>
      <FieldGroup className='grid md:grid-cols-2'>
        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className='col-span-full'>
              <FieldLabel htmlFor="slug-input">Slug</FieldLabel>
              <Input {...field} id="slug-input" placeholder="some-text-as-slug" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="nameRo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name-ro-input">
                Name RO
              </FieldLabel>

              <Input {...field} id="name-ru-input" placeholder="Name RO" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="nameRu"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name-ro-input">
                Name RU
              </FieldLabel>

              <Input {...field} id="name-ru-input" placeholder="Name RU" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </fieldset>
  );
};