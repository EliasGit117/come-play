import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ComponentProps, FC } from 'react';
import { FilePlus2Icon } from 'lucide-react';
import { useCreateNewsDialogContext } from '@/routes/admin/news/-components/create-news-dialog/provider';

interface ICreateNewsDialogTriggerProps extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  shortText?: boolean;
}

export const CreateNewsDialogTrigger: FC<ICreateNewsDialogTriggerProps> = (props) => {
  const { children, asChild, shortText, ...btnProps } = props;
  const { open } = useCreateNewsDialogContext();

  let text = shortText ? 'Create' : 'Create news';

  return (
    <Button onClick={open} asChild={asChild} {...btnProps} {...btnProps}>
      {(asChild && children) ?? (
        <>
          <FilePlus2Icon/>
          <span className="sr-only sm:not-sr-only">{text}</span>
        </>
      )}
    </Button>
  );
};