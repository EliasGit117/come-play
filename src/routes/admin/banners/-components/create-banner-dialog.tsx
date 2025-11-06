import { FC, useEffect, useState, createContext, useContext, ReactNode, ComponentProps } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { LoadingButton } from '@/components/ui/loading-button';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendIcon, XIcon } from 'lucide-react';
import { createBannerSchema, TCreateBannerSchema } from '@/features/banners/schemas/create-banner';
import { useCreateBannerMutation } from '@/features/banners/server-functions/admin/create-banner';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

// Context
interface ICreateBannerDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CreateBannerDialogContext = createContext<ICreateBannerDialogProps | undefined>(undefined);

export const CreateBannerDialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <CreateBannerDialogContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </CreateBannerDialogContext.Provider>
  );
};

export const useCreateBannerDialog = () => {
  const context = useContext(CreateBannerDialogContext);
  if (!context)
    throw new Error(
      'useCreateBannerDialog must be used within a CreateBannerDialogProvider'
    );

  return context;
};

// Form Component
interface BannerFormProps extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  disabled?: boolean;
  className?: string;
  onSubmit?: (values: TCreateBannerSchema) => void;
  form: ReturnType<typeof useForm<TCreateBannerSchema>>;
}

const BannerForm: FC<BannerFormProps> = ({ id, className, form, disabled, onSubmit, ...props }) => {

  return (
    <form id={id} onSubmit={onSubmit ? form.handleSubmit(onSubmit) : undefined}>
      <fieldset disabled={disabled} className={className}>
        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2">
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="title-input"> Title</FieldLabel>
                <Input
                  {...field}
                  id="title-input"
                  aria-invalid={fieldState.invalid}
                  placeholder="Title for banner"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="path"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="path-input">Path</FieldLabel>
                <Input
                  {...field}
                  id="path-input"
                  aria-invalid={fieldState.invalid}
                  placeholder="some-path-for-the-banner"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
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
                  placeholder="Denumirea pentru banner"
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
                  placeholder="Название для баннера"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="textRo"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="text-ro-input">Romanian text</FieldLabel>
                <Textarea
                  {...field}
                  id="text-ro-input"
                  aria-invalid={fieldState.invalid}
                  placeholder="Descriire"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="textRu"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="text-ru-input">Russian text</FieldLabel>
                <Textarea
                  {...field}
                  id="text-ru-input"
                  aria-invalid={fieldState.invalid}
                  placeholder="Описание"
                  autoComplete="off"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />
        </FieldGroup>
      </fieldset>
    </form>
  );
};

// Main Dialog Component
interface CreateBannerDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  afterSuccess?: () => void;
}

const CreateBannerDialog: FC<CreateBannerDialogProps> = ({
                                                           open,
                                                           setOpen,
                                                           afterSuccess
                                                         }) => {
  const navigate = useNavigate();
  const [editAfterCreation, setEditAfterCreation] = useState(true);
  const form = useForm<TCreateBannerSchema>({
    resolver: zodResolver(createBannerSchema),
    defaultValues: {
      title: '',
      path: '',
      titleRo: '',
      titleRu: '',
      textRo: '',
      textRu: ''
    }
  });

  const { mutate, isPending } = useCreateBannerMutation({
    onError: (e) => toast.error(e.name, { description: e.message }),
    onSuccess: (res) => {
      setOpen(false);
      toast.success('Banner has been successfully created');
      afterSuccess?.();

      if (editAfterCreation)
        void navigate({ to: '/admin/banners/$id/edit', params: { id: `${res.id}` } });
    }
  });

  useEffect(() => {
    if (!open) return;

    setEditAfterCreation(true);
    form.reset();
  }, [open, form]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="sm:max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Create Banner</AlertDialogTitle>
          <AlertDialogDescription>
            Fill out the form below to create a new banner entry.
          </AlertDialogDescription>
        </AlertDialogHeader>


        <ScrollArea type="always" className="-mx-4 px-4">
          <BannerForm
            form={form}
            id="create-banner-form"
            className="max-h-96 mt-3 mb-1"
            onSubmit={(data: TCreateBannerSchema) => mutate(data)}
          />
        </ScrollArea>

        <div className="flex items-start gap-3 mt-8">
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
              Redirect to edit banner page to add new data or change existing ones
            </p>
          </div>
        </div>

        <AlertDialogFooter className="flex-row mt-6">
          <AlertDialogCancel type="button" className="flex-1 sm:flex-none">
            <XIcon/>
            <span>Cancel</span>
          </AlertDialogCancel>

          <LoadingButton form="create-banner-form" type="submit" loading={isPending} className="flex-1 sm:flex-none">
            <SendIcon/>
            <span>Submit</span>
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateBannerDialog;