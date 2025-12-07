import { Button, buttonVariants } from '@/components/ui/button';
import { ComponentProps, FC } from 'react';
import { PenIcon } from 'lucide-react';
import { useEditSubcategoryDialogContext } from './provider';
import { Slot as SlotPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface IEditSubcategoryDialogTriggerProps
  extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  subcategoryId: number;
  shortText?: boolean;
  withoutStyles?: boolean;
  asChild?: boolean;
}

export const EditSubcategoryDialogTrigger: FC<IEditSubcategoryDialogTriggerProps> = (
  props
) => {
  const {
    subcategoryId,
    shortText,
    children,
    className,
    variant,
    size,
    asChild = false,
    withoutStyles = false,
    ...btnProps
  } = props;

  const { setSubcategoryId } = useEditSubcategoryDialogContext();
  const text = shortText ? 'Edit' : 'Edit subcategory';
  const open = () => setSubcategoryId(subcategoryId);

  const Comp = asChild ? SlotPrimitive.Slot : 'button';

  return (
    <Comp
      onClick={open}
      data-slot="button"
      className={
        !withoutStyles
          ? cn(buttonVariants({ variant, size, className }))
          : className
      }
      {...btnProps}
    >
      {children ?? (
        <>
          <PenIcon />
          <span className="sr-only sm:not-sr-only">{text}</span>
        </>
      )}
    </Comp>
  );
};