import { IconFilePlus } from '@tabler/icons-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { ComponentProps, FC } from 'react';

import { Slot as SlotPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { useCreateSubcategoryDialogContext } from './provider';

interface ICreateSubcategoryDialogTriggerProps extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  shortText?: boolean;
  withoutStyles?: boolean;
}

export const CreateSubcategoryTrigger: FC<ICreateSubcategoryDialogTriggerProps> = (props) => {
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


  const { open } = useCreateSubcategoryDialogContext();
  const text = shortText ? 'Create' : 'Create subcategory';

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