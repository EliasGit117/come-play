import { IconSelector } from '@tabler/icons-react';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import { TCreateProductSchema } from '@/features/products/schemas/create-product';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface IProductFormProps {
  disabled?: boolean;
  className?: string;
}

export const ProductForm: FC<IProductFormProps> = ({ disabled, className }) => {
  const form = useFormContext<TCreateProductSchema>();

  return (
    <fieldset disabled={disabled} className={className}>
      <FieldGroup className="grid grid-cols-1 sm:grid-cols-2">
        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
              <FieldLabel htmlFor="slug-input">Slug</FieldLabel>
              <Input {...field} id="slug-input" placeholder="some-slug-for-product" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="nameRo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name-ro-input">Romanian name</FieldLabel>
              <Input {...field} id="name-ro-input" placeholder="Nume produs" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="nameRu"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name-ru-input">Russian name</FieldLabel>
              <Input
                {...field}
                id="name-ru-input"
                placeholder="Название продукта"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="shortDescriptionRo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Short romanian description</FieldLabel>
              <Textarea {...field} placeholder="Descriere scurtă" value={field.value ?? ''} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="shortDescriptionRu"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Short russian description</FieldLabel>
              <Textarea
                {...field}
                placeholder="Краткое описание"
                value={field.value ?? ''}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="price"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="price-input">Price</FieldLabel>
              <Input
                {...field}
                id="price-input"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={field.value ?? ''}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="oldPrice"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="oldPrice-input">Old Price</FieldLabel>
              <Input
                {...field}
                id="oldPrice-input"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={field.value ?? ''}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="state"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="state-select">State</FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger id="state-select">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="not_available">Not Available</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="sticker"
          control={form.control}
          render={({ field, fieldState }) => {
            const stickers = [
              { value: 'new', label: 'New' },
              { value: 'sale', label: 'Sale' },
            ];
            const foundSticker = stickers.find(st => st.value === field.value);

            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Sticker</FieldLabel>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn('justify-start', !field.value && 'text-muted-foreground')}
                    >
                      <span>{field.value ? (foundSticker ? foundSticker.label : `Sticker: ${field.value}`) : 'None'}</span>
                      <IconSelector className="text-muted-foreground ml-auto" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-[var(--radix-popper-anchor-width)]" align="end">
                    <DropdownMenuItem onSelect={() => field.onChange(undefined)}>
                      None
                    </DropdownMenuItem>

                    {stickers.map((st) => (
                      <DropdownMenuItem key={st.value} onSelect={() => field.onChange(st.value)}>
                        {st.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );
          }}
        />

        <Controller
          name="hidden"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              orientation="horizontal"
              data-invalid={fieldState.invalid}
              className="sm:col-span-2"
            >
              <Checkbox
                id="hidden-checkbox"
                checked={field.value ?? false}
                onCheckedChange={(value) => field.onChange(value)}
                aria-invalid={fieldState.invalid}
              />
              <FieldContent>
                <FieldLabel htmlFor="hidden-checkbox">Hidden</FieldLabel>
                <FieldDescription>
                  Hide this product from the storefront
                </FieldDescription>
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>
    </fieldset>
  );
};