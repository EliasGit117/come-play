import { IconArrowBarToUp } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { ComponentProps, FC } from 'react';

import { useReorderBannersDialogContext } from './provider';

interface IReorderBannersDialogTriggerProps extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  shortText?: boolean;
}

export const ReorderBannersDialogTrigger: FC<IReorderBannersDialogTriggerProps> = (props) => {
  const { asChild, children, shortText, ...btnProps } = props;
  const { open } = useReorderBannersDialogContext();

  const text = shortText ? 'Reorder' : 'Reorder banners';

  return (
    <Button onClick={open} asChild={asChild} {...btnProps}>
      {(asChild && children) ?? (
        <>
          <IconArrowBarToUp />
          <span className="sr-only sm:not-sr-only">{text}</span>
        </>
      )}
    </Button>
  );
};