import { IconPencil } from '@tabler/icons-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { ComponentProps, FC } from 'react';

import { useEditCategoryDialogContext } from './provider';
import { Slot as SlotPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface IEditCategoryDialogTriggerProps
  extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  withoutStyles?: boolean;
  categoryId: number;
  shortText?: boolean;
  asChild?: boolean;
}

export const EditCategoryDialogTrigger: FC<IEditCategoryDialogTriggerProps> = (props) => {
  const {
    categoryId,
    shortText,
    children,
    className,
    variant,
    size,
    asChild = false,
    withoutStyles = false,
    ...btnProps
  } = props;
  const { setCategoryId } = useEditCategoryDialogContext();

  const text = shortText ? 'Edit' : 'Edit category';
  const open = () => setCategoryId(categoryId);

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
          <IconPencil />
          <span className="sr-only sm:not-sr-only">{text}</span>
        </>
      )}
    </Comp>
  )
};