import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { TEditBannerSchema } from '@/features/banners/schemas/edit-banner';
import { m } from '@/paraglide/messages';


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
              <FieldLabel htmlFor="title-input">{m['pages.admin.banners.form.title']()}</FieldLabel>
              <Input
                {...field}
                id="title-input"
                aria-invalid={fieldState.invalid}
                placeholder={m['pages.admin.banners.form.titleRoPlaceholder']()}
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
              <FieldLabel htmlFor="path-input">{m['pages.admin.banners.form.path']()}</FieldLabel>
              <Input
                {...field}
                id="path-input"
                aria-invalid={fieldState.invalid}
                placeholder={m['pages.admin.banners.form.pathPlaceholderEdit']()}
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
              <FieldLabel htmlFor="title-ro-input">{m['pages.admin.shared.fields.titleRo']()}</FieldLabel>
              <Input
                {...field}
                id="title-ro-input"
                aria-invalid={fieldState.invalid}
                placeholder={m['pages.admin.banners.form.titleRoPlaceholder']()}
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
              <FieldLabel htmlFor="title-ru-input">{m['pages.admin.shared.fields.titleRu']()}</FieldLabel>
              <Input
                {...field}
                id="title-ru-input"
                aria-invalid={fieldState.invalid}
                placeholder={m['pages.admin.banners.form.titleRuPlaceholder']()}
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
              <FieldLabel htmlFor="text-ro-textarea">{m['pages.admin.banners.form.textRo']()}</FieldLabel>
              <Textarea
                {...field}
                id="text-ro-textarea"
                aria-invalid={fieldState.invalid}
                placeholder={m['pages.admin.banners.form.textRoPlaceholder']()}
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
              <FieldLabel htmlFor="text-ru-textarea">{m['pages.admin.banners.form.textRu']()}</FieldLabel>
              <Textarea
                {...field}
                id="text-ru-textarea"
                aria-invalid={fieldState.invalid}
                placeholder={m['pages.admin.banners.form.textRuPlaceholder']()}
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
                  {m['pages.admin.banners.form.isActiveEdit']()}
                </FieldLabel>
                <FieldDescription>
                  {m['pages.admin.banners.form.isActiveEditDescription']()}
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </FieldContent>
            </Field>
          )}/>
      </FieldGroup>
    </fieldset>
  );
};