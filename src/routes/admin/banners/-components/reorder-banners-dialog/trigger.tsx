import { IconArrowBarToUp } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { ComponentProps, FC } from 'react';

import { useReorderBannersDialogContext } from './provider';
import { m } from '@/paraglide/messages';

interface IReorderBannersDialogTriggerProps extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  shortText?: boolean;
}

export const ReorderBannersDialogTrigger: FC<IReorderBannersDialogTriggerProps> = (props) => {
  const { asChild, children, shortText, ...btnProps } = props;
  const { open } = useReorderBannersDialogContext();

  const text = shortText ? m['pages.admin.banners.reorder.trigger.short']() : m['pages.admin.banners.reorder.trigger.full']();

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