import { Button } from '@/components/ui/button';
import { ComponentProps, FC } from 'react';
import { FilePlus2Icon } from 'lucide-react';
import { useCreateBannerDialogContext } from './provider';

interface ICreateBannerDialogTriggerProps
  extends Omit<ComponentProps<typeof Button>, 'onClick'> {}

export const CreateBannerDialogTrigger: FC<ICreateBannerDialogTriggerProps> = (props) => {
  const {
    asChild,
    children,
    ...btnProps
  } = props;

  const { open } = useCreateBannerDialogContext();

  return (
    <Button onClick={open} asChild={asChild} {...btnProps}>
      {(asChild && children) ?? (
        <>
          <FilePlus2Icon />
          <span className="sr-only sm:not-sr-only">Create banner</span>
        </>
      )}
    </Button>
  );
};