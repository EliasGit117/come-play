import { createFileRoute, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { CheckIcon, LoaderCircle } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { NewsForm, newsFormSchema, TPostForm } from '@/routes/admin/news/-components/news-form/news-form';


export const Route = createFileRoute('/admin/news/create')({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: 'Create Post' }]
  })
});

function RouteComponent() {
  const form = useForm<TPostForm>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: '',
      content: '',
      link: ''
    }
  });

  const { mutate, isPending } = useMutation({
    // mutationFn: (data: TPostForm) => createPost({ data: data }),
    // mutationFn: (data: TPostForm) => {},
    onSuccess: () => {
      form.reset();
      toast.success('Post successfully created!');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const onSubmit = (values: TPostForm) => {
    // mutate(values);
  };

  return (
    <main className="container mx-auto p-4 space-y-4">
      <article>
        <h2 className="text-2xl">
          Create new post
        </h2>
        <p className="text-sm text-muted-foreground">
          Fill out the form below to create a new post
        </p>
      </article>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <NewsForm disabled={isPending} />

          <Button className="w-full sm:w-fit ml-auto" disabled={isPending}>
            {
              isPending ?
                <>
                  <LoaderCircle className='animate-spin'/>
                  <span>Loading</span>
                </> :
                <>
                  <CheckIcon/>
                  <span>Submit</span>
                </>
            }
          </Button>
        </form>
      </Form>

    </main>
  );
}
