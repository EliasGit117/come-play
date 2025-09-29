import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import z from 'zod';
import { Input } from '@/components/ui/input';
import { RichEditor } from '@/components/editor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewsStatus } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { ChevronDownIcon, EyeIcon, EyeOffIcon } from 'lucide-react';


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
    <fieldset disabled={disabled} className={cn('grid md:grid-cols-2 gap-4', className)}>
      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem className="col-span-full sm:col-span-1">
            <FormLabel>
              Slug
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
        name="status"
        render={({ field }) => (
          <FormItem className="col-span-full sm:col-span-1">
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full justify-start" asChild>
                  <button type='button'>
                    {field.value === NewsStatus.hidden ? <EyeOffIcon/> : <EyeIcon/>}
                    <span className="capitalize">{field.value}</span>
                    <ChevronDownIcon className='ml-auto'/>
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
              <Input placeholder="Some title" {...field}/>
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
              <Input placeholder="Some title" {...field}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />

      <Tabs defaultValue="RO" className="col-span-full">
        <TabsList>
          <TabsTrigger value="RO">Romanian</TabsTrigger>
          <TabsTrigger value="RU">Russian</TabsTrigger>
        </TabsList>

        <TabsContent value="RO">
          <FormField
            control={form.control}
            name="contentRo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">
                  Content RO
                </FormLabel>
                <FormControl>
                  <RichEditor value={field.value ?? ''} onChange={field.onChange}
                              editorClassName="min-h-44 mx-auto px-4"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
        </TabsContent>


        <TabsContent value="RU">
          <FormField
            control={form.control}
            name="contentRu"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">
                  Content RU
                </FormLabel>
                <FormControl>
                  <RichEditor value={field.value ?? ''} onChange={field.onChange}
                              editorClassName="min-h-44 mx-auto px-4"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
        </TabsContent>
      </Tabs>
    </fieldset>
  );
};

