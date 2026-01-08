import { Button, buttonVariants } from '@/components/ui/button';
import { ComponentProps, FC } from 'react';
import { ArrowUpDownIcon, FilePlus2Icon } from 'lucide-react';
import { useReorderProductImagesDialogContext } from './provider';
import { Slot as SlotPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface IReorderProductImagesDialogTriggerProps
  extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  shortText?: boolean;
  withoutStyles?: boolean;
}

export const ReorderProductImagesDialogTrigger: FC<
  IReorderProductImagesDialogTriggerProps
> = (props) => {
  const { asChild, children, shortText, withoutStyles, variant, size, className, ...btnProps } = props;
  const { open } = useReorderProductImagesDialogContext();

  const text = shortText ? 'Reorder' : 'Reorder images';
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
          <FilePlus2Icon />
          <span className="sr-only sm:not-sr-only">{text}</span>
        </>
      )}
    </Comp>
  )
};