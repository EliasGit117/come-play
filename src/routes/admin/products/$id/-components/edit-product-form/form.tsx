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
import { Textarea } from '@/components/ui/textarea';
import { TEditProductSchema } from '@/features/products/schemas/edit-product';
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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronsUpDownIcon } from 'lucide-react';


interface IEditProductFormProps {
  disabled?: boolean;
  className?: string;
}

export const EditProductForm: FC<IEditProductFormProps> = ({ className, disabled }) => {
  const form = useFormContext<TEditProductSchema>();

  return (
    <fieldset disabled={disabled} className={className}>
      <FieldGroup className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Controller
          name="nameRo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="lg:col-span-2">
              <FieldLabel htmlFor="nameRo-input">Name (Romanian)</FieldLabel>
              <Input
                {...field}
                id="nameRo-input"
                placeholder="Nume produs"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
            </Field>
          )}
        />

        <Controller
          name="nameRu"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="lg:col-span-2">
              <FieldLabel htmlFor="nameRu-input">Name (Russian)</FieldLabel>
              <Input
                {...field}
                id="nameRu-input"
                placeholder="Название продукта"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
            </Field>
          )}
        />

        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="lg:col-span-4">
              <FieldLabel htmlFor="slug-input">Slug</FieldLabel>
              <Input
                {...field}
                id="slug-input"
                placeholder="product-slug"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
            </Field>
          )}
        />

        <Controller
          name="state"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="state-select">State</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="state-select">
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="not_available">Not Available</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
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
                      <ChevronsUpDownIcon className="text-muted-foreground ml-auto" />
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
          name="shortDescriptionRo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="lg:col-span-2" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="short-description-ro-textarea">
                Russian short description
              </FieldLabel>
              <Textarea
                {...field}
                id="short-description-ro-textarea"
                placeholder="Descriere scurtă"
                value={field.value ?? ''}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
            </Field>
          )}
        />

        <Controller
          name="shortDescriptionRu"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="lg:col-span-2" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="short-description-ru-textarea">
                Romanian short description
              </FieldLabel>
              <Textarea
                {...field}
                id="short-description-ru-textarea"
                placeholder="Краткое описание"
                value={field.value ?? ''}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
            </Field>
          )}
        />

        <Controller
          name="hidden"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              className="lg:col-span-2"
              orientation="horizontal"
              data-invalid={fieldState.invalid}
            >
              <Checkbox
                id="hidden-checkbox"
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
              />
              <FieldContent>
                <FieldLabel htmlFor="hidden-checkbox" className="font-normal">
                  Hidden
                </FieldLabel>
                <FieldDescription>
                  Hide this product from the storefront
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>
    </fieldset>
  );
};