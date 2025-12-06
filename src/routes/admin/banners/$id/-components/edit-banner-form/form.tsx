import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { TEditBannerSchema } from '@/features/banners/schemas/edit-banner';


interface IEditBannerFormProps {
  disabled?: boolean;
  className?: string;
}

export const EditBannerForm: FC<IEditBannerFormProps> = ({ className, disabled }) => {
  const form = useFormContext<TEditBannerSchema>();

  return (
    <fieldset disabled={disabled} className={className}>
      <FieldGroup className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title-input">Title</FieldLabel>
              <Input
                {...field}
                id="title-input"
                aria-invalid={fieldState.invalid}
                placeholder="Denumirea bannerului"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="path"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="path-input">Path</FieldLabel>
              <Input
                {...field}
                id="path-input"
                aria-invalid={fieldState.invalid}
                placeholder="/path/to/page"
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
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
                placeholder="Denumirea bannerului"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="titleRu"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title-ru-input">Russian title</FieldLabel>
              <Input
                {...field}
                id="title-ru-input"
                aria-invalid={fieldState.invalid}
                placeholder="Название баннера"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="textRo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className='lg:col-span-2' data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="text-ro-textarea">Romanian text</FieldLabel>
              <Textarea
                {...field}
                id="text-ro-textarea"
                aria-invalid={fieldState.invalid}
                placeholder="Descriire"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
            </Field>
          )}
        />

        <Controller
          name="textRu"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className='lg:col-span-2' data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="text-ru-textarea">Russian text</FieldLabel>
              <Textarea
                {...field}
                id="text-ru-textarea"
                aria-invalid={fieldState.invalid}
                placeholder="Описание"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
            </Field>
          )}
        />

        <Controller
          name="isActive"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className='lg:col-span-2' orientation="horizontal" data-invalid={fieldState.invalid}>
              <Checkbox
                id="is-active-checkbox"
                name={field.name}
                aria-invalid={fieldState.invalid}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FieldContent>
                <FieldLabel htmlFor="is-active-checkbox" className="font-normal">
                  Active
                </FieldLabel>
                <FieldDescription>
                  Represents the state of banner so it application would know to show it for user or not
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </FieldContent>
            </Field>
          )}/>
      </FieldGroup>
    </fieldset>
  );
};