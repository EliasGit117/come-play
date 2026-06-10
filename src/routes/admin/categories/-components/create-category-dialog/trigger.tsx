import { IconFilePlus } from '@tabler/icons-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { ComponentProps, FC } from 'react';

import { useCreateCategoryDialogContext } from './provider';
import { Slot as SlotPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface ICreateCategoryDialogTriggerProps extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  shortText?: boolean;
  withoutStyles?: boolean;
}

export const CreateCategoryDialogTrigger: FC<ICreateCategoryDialogTriggerProps> = (props) => {
  const {
    shortText,
    children,
    className,
    variant,
    size,
    asChild = false,
    withoutStyles = false,
    ...btnProps
  } = props;


  const { open } = useCreateCategoryDialogContext();
  const text = shortText ? 'Create' : 'Create category';

  const Comp = asChild ? SlotPrimitive.Slot : "button"

  return (
    <Comp
      onClick={open}
      data-slot="button"
      className={!withoutStyles ? cn(buttonVariants({ variant, size, className })) : className}
      {...btnProps}
    >
      {children ?? (
        <>
          <IconFilePlus />
          <span className="sr-only sm:not-sr-only">{text}</span>
        </>
      )}
    </Comp>
  )
};