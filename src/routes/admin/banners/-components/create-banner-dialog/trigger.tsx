import { Button } from '@/components/ui/button';
import { ComponentProps, FC } from 'react';
import { FilePlus2Icon } from 'lucide-react';
import { useCreateBannerDialogContext } from './provider';

interface ICreateBannerDialogTriggerProps extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  shortText?: boolean;
}

export const CreateBannerDialogTrigger: FC<ICreateBannerDialogTriggerProps> = (props) => {
  const {
    asChild,
    children,
    shortText,
    ...btnProps
  } = props;

  const { open } = useCreateBannerDialogContext();
  const text = shortText ? 'Create' : 'Create banner';

  return (
    <Button onClick={open} asChild={asChild} {...btnProps}>
      {(asChild && children) ?? (
        <>
          <FilePlus2Icon />
          <span className="sr-only sm:not-sr-only">{text}</span>
        </>
      )}
    </Button>
  );
};