import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import { TCreateBannerSchema } from '@/features/banners/server-functions/admin/create-banner';
import { Textarea } from '@/components/ui/textarea';


export interface IPostProps {
  disabled?: boolean;
  className?: string;
}

export const BannerForm: FC<IPostProps> = ({ className, disabled }) => {
  const form = useFormContext<TCreateBannerSchema>();

  return (
    <fieldset disabled={disabled} className={className}>
      <FieldGroup>
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
                placeholder="Denumirea pentru banner"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
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
                placeholder="some-path-for-the-banner"
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
                placeholder="Denumirea pentru banner"
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
              <FieldLabel htmlFor="title-ru-input">Russian title</FieldLabel>
              <Input
                {...field}
                id="title-ru-input"
                aria-invalid={fieldState.invalid}
                placeholder="Название для баннера"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
            </Field>
          )}
        />

        <Controller
          name="textRo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="text-ro-input">Romanian text</FieldLabel>
              <Textarea
                {...field}
                id="text-ro-input"
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
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title-ru-input">Russian text</FieldLabel>
              <Textarea
                {...field}
                id="title-ru-input"
                aria-invalid={fieldState.invalid}
                placeholder="Описание"
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
                  Redirect to edit banner page to add new data or change existing ones
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </FieldContent>
            </Field>
          )}/>
      </FieldGroup>
    </fieldset>
  );
};

