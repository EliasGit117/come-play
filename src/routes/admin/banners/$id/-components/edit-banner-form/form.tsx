import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import z from 'zod';

export const editBannerFormSchema = z.object({
  titleRo: z.string().min(3).max(256),
  titleRu: z.string().min(3).max(256),
  path: z.string().regex(/^[a-zA-Z0-9-/]+$/).min(3).max(1000).optional().or(z.literal('')),
  order: z.number().int().min(0),
  isActive: z.boolean()
});

export type TEditBannerFormSchema = z.infer<typeof editBannerFormSchema>;

interface IBannerFormProps {
  disabled?: boolean;
}

export const EditBannerForm: FC<IBannerFormProps> = ({ disabled }) => {
  const form = useFormContext<TEditBannerFormSchema>();

  return (
    <>
      <FormField
        control={form.control}
        name="titleRo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title (RO)</FormLabel>
            <FormControl>
              <Input {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="titleRu"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title (RU)</FormLabel>
            <FormControl>
              <Input {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="path"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Path (optional)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="/path/to/page" disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="order"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Order</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Active</FormLabel>
            </div>
          </FormItem>
        )}
      />
    </>
  );
};