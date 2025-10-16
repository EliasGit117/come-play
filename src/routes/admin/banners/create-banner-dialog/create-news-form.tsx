import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { TCreatNewsSchema } from '@/features/news/server-functions/admin/create-news';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';


export interface IPostProps {
  disabled?: boolean;
  className?: string;
}

export const NewsForm: FC<IPostProps> = ({ className, disabled }) => {
  const form = useFormContext<TCreatNewsSchema>();

  return (
    <fieldset disabled={disabled} className={className}>
      <FieldGroup>
        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="slug-input">Slug</FieldLabel>
              <Input
                {...field}
                id="slug-input"
                aria-invalid={fieldState.invalid}
                placeholder="some-slug-for-product"
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
              <FieldLabel htmlFor="title-ro-input">Romanian title</FieldLabel>
              <Input
                {...field}
                id="title-ro-input"
                aria-invalid={fieldState.invalid}
                placeholder="Denumirea produsului"
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
              <FieldLabel htmlFor="title-ru-input">Romanian title</FieldLabel>
              <Input
                {...field}
                id="title-ru-input"
                aria-invalid={fieldState.invalid}
                placeholder="Название продукта"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
            </Field>
          )}
        />

        <Controller
          name="editAfterCreation"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <Checkbox
                id="edit-after-creation-checkbox"
                name={field.name}
                aria-invalid={fieldState.invalid}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FieldContent>
                <FieldLabel htmlFor="edit-after-creation-checkbox" className="font-normal">
                  Edit after creation
                </FieldLabel>
                <FieldDescription>
                  Redirect to created product page to edit it
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </FieldContent>
            </Field>
          )}/>
      </FieldGroup>
    </fieldset>
  );
};

