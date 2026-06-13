import { IconFilePlus } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { ComponentProps, FC } from 'react';

import { useCreateBannerDialogContext } from './provider';
import { m } from '@/paraglide/messages';

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
  const text = shortText ? m['pages.admin.banners.create.trigger.short']() : m['pages.admin.banners.create.trigger.full']();

  return (
    <Button onClick={open} asChild={asChild} {...btnProps}>
      {(asChild && children) ?? (
        <>
          <IconFilePlus />
          <span className="sr-only sm:not-sr-only">{text}</span>
        </>
      )}
    </Button>
  );
};