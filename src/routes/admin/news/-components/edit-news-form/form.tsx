import { FormControl } from '@/components/ui/form';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import z from 'zod';
import { Input } from '@/components/ui/input';
import { RichEditor } from '@/components/editor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewsStatus } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { ChevronDownIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';


export const newsFormSchema = z.object({
  slug: z.string().regex(/^[a-zA-Z0-9-]+$/).min(3).max(1000),
  status: z.nativeEnum(NewsStatus),
  titleRo: z.string().min(3).max(256),
  titleRu: z.string().min(3).max(256),
  contentRo: z.string().max(10240).optional(),
  contentRu: z.string().max(10240).optional()
});

export type TNewsFormSchema = z.infer<typeof newsFormSchema>;

export interface IPostProps {
  disabled?: boolean;
  className?: string;
}

export const NewsForm: FC<IPostProps> = ({ className, disabled }) => {
  const form = useFormContext<TNewsFormSchema>();

  return (
    <fieldset disabled={disabled} className={className}>
      <FieldGroup className='grid md:grid-cols-2 xl:grid-cols-4 gap-4'>
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
          name="status"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="status-select">Status</FieldLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full justify-start" asChild>
                    <button type="button">
                      {field.value === NewsStatus.hidden ? <EyeOffIcon/> : <EyeIcon/>}
                      <span className="capitalize">{field.value}</span>
                      <ChevronDownIcon className="ml-auto"/>
                    </button>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={NewsStatus.published}>
                    <EyeIcon/>
                    <span>Published</span>
                  </SelectItem>
                  <SelectItem value={NewsStatus.hidden}>
                    <EyeOffIcon/>
                    <span>Hidden</span>
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
              <FieldLabel htmlFor="title-ru-input">Russian title</FieldLabel>
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

        <Tabs defaultValue="RO" className="col-span-full">
          <TabsList>
            <TabsTrigger value="RO">Romanian</TabsTrigger>
            <TabsTrigger value="RU">Russian</TabsTrigger>
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

