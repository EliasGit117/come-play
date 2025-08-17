import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import z from 'zod';
import { Input } from '@/components/ui/input';
import { createNewsSchema } from '@/features/news/server-functions/create-news';
import { Checkbox } from '@/components/ui/checkbox';


export const createNewsFormSchema = createNewsSchema.extend({
  editAfterCreation: z.boolean()
});

export type TCreateNewsFormSchema = z.infer<typeof createNewsFormSchema>;

export interface IPostProps {
  disabled?: boolean;
  className?: string;
}

export const NewsForm: FC<IPostProps> = ({ className, disabled }) => {
  const form = useFormContext<TCreateNewsFormSchema>();

  return (
    <fieldset disabled={disabled} className={cn('grid gap-4', className)}>
      <FormField
        control={form.control}
        name="link"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Link
            </FormLabel>
            <FormControl>
              <Input placeholder="example-link-for-post" {...field}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="titleRo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Title RO
            </FormLabel>
            <FormControl>
              <Input placeholder="Some romanian title" {...field}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="titleRu"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Title RU
            </FormLabel>
            <FormControl>
              <Input placeholder="Some russian title" {...field}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="editAfterCreation"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center gap-2">
            <FormControl >
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="text-sm font-normal">
              Open edit news after creation
            </FormLabel>
          </FormItem>
        )}
      />
    </fieldset>
  );
};

