import { IconSelector } from '@tabler/icons-react';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field';
import { TCreateSubcategorySchema } from '@/features/subcategories/schemas/create-subcategory';
import { useQuery } from '@tanstack/react-query';
import {
  getCategoriesPaginatedForAdminQueryOptions
} from '@/features/categories/server-functions/admin/get-categories-paginated-for-admin';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

export const SubcategoryForm: FC = () => {
  const form = useFormContext<TCreateSubcategorySchema>();

  const { data } = useQuery(
    getCategoriesPaginatedForAdminQueryOptions({ limit: 10000, page: 1 })
  );

  return (
    <FieldGroup className="grid md:grid-cols-2 gap-4">
      <Controller
        name="slug"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="col-span-2">
            <FieldLabel>Slug</FieldLabel>
            <Input {...field} placeholder="subcategory-slug"/>
            {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
          </Field>
        )}
      />

      <Controller
        name="nameRo"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="col-span-2 md:col-span-1">
            <FieldLabel>Romanian name</FieldLabel>
            <Input {...field} placeholder="Subcategory name (RO)"/>
            {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
          </Field>
        )}
      />

      <Controller
        name="nameRu"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="col-span-2 md:col-span-1">
            <FieldLabel>Russian name</FieldLabel>
            <Input {...field} placeholder="Subcategory name (RU)"/>
            {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
          </Field>
        )}
      />

      <Controller
        name="categoryId"
        control={form.control}
        render={({ field, fieldState }) => {
          const foundCategory = data?.items.find(ctg => ctg.id === field.value);

          return (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <FieldLabel>Category</FieldLabel>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className={cn("justify-start", !field.value && 'text-muted-foreground')}>
                    <span>
                      {field.value ? (foundCategory ? foundCategory.nameRo : `Category id: ${field.value}`) : 'None'}
                    </span>
                    <IconSelector className="text-muted-foreground ml-auto"/>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-[var(--radix-popper-anchor-width)]" align="end">
                  <DropdownMenuItem onSelect={() => field.onChange(undefined)}>
                    None
                  </DropdownMenuItem>

                  {data?.items?.map((cat) => (
                    <DropdownMenuItem key={cat.id} onSelect={() => field.onChange(cat.id)}>
                      {cat.nameRo}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
            </Field>
          );
        }}
      />

      <Controller
        name="descriptionRo"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="col-span-2 md:col-span-1">
            <FieldLabel htmlFor="description-ro-textarea">Romanian description</FieldLabel>
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
          <Field data-invalid={fieldState.invalid} className="col-span-2 md:col-span-1">
            <FieldLabel htmlFor="description-ru-textarea">Russian description</FieldLabel>
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
  );
};