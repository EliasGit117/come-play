import { IconFilePlus } from '@tabler/icons-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { ComponentProps, FC } from 'react';

import { useCreateProductDialogContext } from './provider';
import { Slot as SlotPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface ICreateProductDialogTriggerProps
  extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  shortText?: boolean;
  withoutStyles?: boolean;
}

export const CreateProductDialogTrigger: FC<
  ICreateProductDialogTriggerProps
> = (props) => {
  const { asChild, children, shortText, withoutStyles, variant, size, className, ...btnProps } = props;
  const { open } = useCreateProductDialogContext();
  const text = shortText ? 'Create' : 'Create product';

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