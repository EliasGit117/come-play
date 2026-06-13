import { IconChevronDown, IconEye, IconEyeOff } from '@tabler/icons-react';
import { FormControl } from '@/components/ui/form';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { z } from 'zod'
import { Input } from '@/components/ui/input';
import { RichEditor } from '@/components/editor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewsStatus } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { m } from '@/paraglide/messages';


export const editNewsFormSchema = z.object({
  slug: z.string().regex(/^[a-zA-Z0-9-]+$/).min(3).max(1000),
  status: z.nativeEnum(NewsStatus),
  titleRo: z.string().min(3).max(256),
  titleRu: z.string().min(3).max(256),
  contentRo: z.string().max(10240).optional(),
  contentRu: z.string().max(10240).optional()
});

export type TEditNewsFormSchema = z.infer<typeof editNewsFormSchema>;

export interface IEditNewsFormProps {
  disabled?: boolean;
  className?: string;
}

export const EditNewsForm: FC<IEditNewsFormProps> = ({ className, disabled }) => {
  const form = useFormContext<TEditNewsFormSchema>();

  return (
    <fieldset disabled={disabled} className={className}>
      <FieldGroup className='grid md:grid-cols-2 xl:grid-cols-4 gap-4'>
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
          name="status"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="status-select">{m['pages.admin.shared.fields.status']()}</FieldLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger id="status-select" className="w-full justify-start">
                    {field.value === NewsStatus.hidden ? <IconEyeOff/> : <IconEye/>}
                    <span className="capitalize">
                      {field.value === NewsStatus.hidden ? m['pages.admin.shared.status.hidden']() : m['pages.admin.shared.status.published']()}
                    </span>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={NewsStatus.published}>
                    <IconEye/>
                    <span>{m['pages.admin.shared.status.published']()}</span>
                  </SelectItem>
                  <SelectItem value={NewsStatus.hidden}>
                    <IconEyeOff/>
                    <span>{m['pages.admin.shared.status.hidden']()}</span>
                  </SelectItem>
                </SelectContent>
              </Select>
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

        <Tabs defaultValue="RO" className="col-span-full">
          <TabsList>
            <TabsTrigger value="RO">{m['pages.admin.shared.tabs.romanian']()}</TabsTrigger>
            <TabsTrigger value="RU">{m['pages.admin.shared.tabs.russian']()}</TabsTrigger>
          </TabsList>

          <TabsContent value="RO">
            <Controller
              name="contentRo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <RichEditor
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    editorClassName="min-h-44 mx-auto px-4"
                    menuBarClassName='sticky top-[calc(3rem+1px)] z-10'
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                </Field>
              )}
            />

          </TabsContent>

          <TabsContent value="RU">
            <Controller
              name="contentRu"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <RichEditor
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    editorClassName="min-h-44 mx-auto px-4"
                    menuBarClassName='sticky top-[calc(3rem+1px)] z-10'
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                </Field>
              )}
            />
          </TabsContent>

        </Tabs>
      </FieldGroup>
    </fieldset>
  );
};

