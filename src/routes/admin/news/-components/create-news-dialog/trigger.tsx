import { IconFilePlus } from '@tabler/icons-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ComponentProps, FC } from 'react';

import { useCreateNewsDialogContext } from '@/routes/admin/news/-components/create-news-dialog/provider';
import { m } from '@/paraglide/messages';

interface ICreateNewsDialogTriggerProps extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  shortText?: boolean;
}

export const CreateNewsDialogTrigger: FC<ICreateNewsDialogTriggerProps> = (props) => {
  const { children, asChild, shortText, ...btnProps } = props;
  const { open } = useCreateNewsDialogContext();

  let text = shortText ? m['pages.admin.news.create.trigger.short']() : m['pages.admin.news.create.trigger.full']();

  return (
    <Button onClick={open} asChild={asChild} {...btnProps} {...btnProps}>
      {(asChild && children) ?? (
        <>
          <IconFilePlus/>
          <span className="sr-only sm:not-sr-only">{text}</span>
        </>
      )}
    </Button>
  );
};