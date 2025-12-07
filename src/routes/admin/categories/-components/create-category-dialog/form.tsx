import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { TCreateCategorySchema } from '@/features/categories/schemas/create-category';
import { Textarea } from '@/components/ui/textarea';


interface IBannerFormProps {
  disabled?: boolean;
  className?: string;
}

export const BannerForm: FC<IBannerFormProps> = ({ disabled, className }) => {
  const form = useFormContext<TCreateCategorySchema>();

  return (
    <fieldset disabled={disabled} className={className}>
      <FieldGroup className="grid grid-cols-2">
        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <FieldLabel htmlFor="slug-input">Slug</FieldLabel>
              <Input {...field} id="slug-input" placeholder="some-text-as-slug"/>
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
            </Field>
          )}
        />

        <Controller
          name="nameRo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-2 md:col-span-1">
              <FieldLabel htmlFor="name-ro-input">
                Romanian name
              </FieldLabel>

              <Input {...field} id="name-ru-input" placeholder="Nume"/>
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
            </Field>
          )}
        />

        <Controller
          name="nameRu"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-2 md:col-span-1">
              <FieldLabel htmlFor="name-ro-input">
                Russian name
              </FieldLabel>

              <Input {...field} id="name-ru-input" placeholder="Название"/>
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
            </Field>
          )}
        />

        <Controller
          name="descriptionRo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="col-span-2 sm:col-span-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="text-ro-textarea">Romanian description</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ''}
                id="description-ro-textarea"
                aria-invalid={fieldState.invalid}
                placeholder="Descriire"
                className="min-h-24"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
            </Field>
          )}
        />

        <Controller
          name="descriptionRu"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="col-span-2 sm:col-span-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="text-ru-textarea">Russian description</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ''}
                id="description-ru-textarea"
                aria-invalid={fieldState.invalid}
                placeholder="Описание"
                className="min-h-24"
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