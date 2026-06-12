import { IconSend, IconX } from '@tabler/icons-react';
'use client';

import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Form } from '@/components/ui/form';
import { NewsForm } from './form';
import { LoadingButton } from '@/components/ui/loading-button';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { createNewsSchema, TCreateNewsSchema } from '@/features/news/schemas/create-news';
import { orpc } from '@/lib/orpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCreateNewsDialogContext } from '@/routes/admin/news/-components/create-news-dialog/provider';


interface CreateNewsDialogProps {
  afterSuccess?: () => void;
}

export const CreateNewsDialog: FC<CreateNewsDialogProps> = ({ afterSuccess }) => {
  const { isOpen, setIsOpen } = useCreateNewsDialogContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editAfterCreation, setEditAfterCreation] = useState(true);
  const form = useForm<TCreateNewsSchema>({
    resolver: zodResolver(createNewsSchema),
    defaultValues: {
      slug: '',
      titleRo: '',
      titleRu: '',
    }
  });

  const { mutate, isPending } = useMutation({
    ...orpc.admin.news.create.mutationOptions(),
    onError: (e) => toast.error(e.name, { description: e.message }),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: orpc.admin.news.key() });
      setIsOpen(false);
      toast.success('News has been successfully created');
      afterSuccess?.();

      if (editAfterCreation)
        void navigate({ to: '/admin/news/$id/edit', params: { id: `${res.id}` } });
    }
  });

  useEffect(() => {
    if (!isOpen)
      return;

    setEditAfterCreation(true);
    form.reset();
  }, [isOpen]);


  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="sm:max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values: TCreateNewsSchema) => mutate(values))}>
            <AlertDialogHeader>
              <AlertDialogTitle>Create News</AlertDialogTitle>
              <AlertDialogDescription>
                Fill out the form below to create a new news entry.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <ScrollArea className="pr-4 mt-4" type='always'>
              <NewsForm className='max-h-96'/>

              <div className="flex items-start gap-3 mt-4">
                <Checkbox
                  id="edit-after-creation-checkbox"
                  checked={editAfterCreation}
                  onCheckedChange={(v) => setEditAfterCreation(!!v)}
                  disabled={isPending}
                />
                <div className="grid gap-2">
                  <Label htmlFor="edit-after-creation-checkbox">
                    Edit after creation
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    Redirect to created product page to edit it
                  </p>
                </div>
              </div>
            </ScrollArea>

            <AlertDialogFooter className="flex-row mt-6">
              <AlertDialogCancel type="button" className='flex-1 sm:flex-none'>
                <IconX/>
                <span>Cancel</span>
              </AlertDialogCancel>

              <LoadingButton type="submit" loading={isPending} className='flex-1 sm:flex-none'>
                <IconSend/>
                <span>Submit</span>
              </LoadingButton>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
