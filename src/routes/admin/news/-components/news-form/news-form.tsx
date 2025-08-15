import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import z from 'zod';
import { Input } from '@/components/ui/input';
import { RichEditor } from '@/components/editor';


export const newsFormSchema = z.object({
  link: z.string().regex(/^[a-zA-Z0-9-]+$/).min(3).max(1000),
  title: z.string().min(3).max(256),
  content: z.string().min(3).max(10240),
});

export type TPostForm = z.infer<typeof newsFormSchema>;

export interface IPostProps {
  disabled?: boolean;
  className?: string;
}

export const NewsForm: FC<IPostProps> = ({ className, disabled }) => {
  const form = useFormContext<TPostForm>();

  return (
    <fieldset disabled={disabled} className={cn('grid md:grid-cols-2 gap-4', className)}>
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
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Title
            </FormLabel>
            <FormControl>
              <Input placeholder="Some title" {...field}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem className='col-span-full'>
            <FormLabel>
              Content
            </FormLabel>
            <FormControl>
              <RichEditor value={field.value} onChange={field.onChange} editorClassName='min-h-44 mx-auto px-4'/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />
    </fieldset>
  );
};

