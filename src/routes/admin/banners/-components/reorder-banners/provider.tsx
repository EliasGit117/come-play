import React, { createContext, useContext, useState, ReactNode, ComponentProps } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { Slot as SlotPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface IReorderBannerSheetProvider {
  isSheetOpen: boolean;
  setIsSheetOpen: (isOpen: boolean) => void;
}

const ReorderBannerSheetContext = createContext<IReorderBannerSheetProvider | undefined>(undefined);

export const ReorderBannerSheetProvider = ({ children }: { children: ReactNode; }) => {
  const [open, setOpen] = useState<boolean>(false);


  return (
    <ReorderBannerSheetContext.Provider value={{ isSheetOpen: open, setIsSheetOpen: setOpen }}>
      {children}
    </ReorderBannerSheetContext.Provider>
  );
};

export const useReorderBannerSheet = () => {
  const context = useContext(ReorderBannerSheetContext);
  if (!context)
    throw new Error(
      'useReorderBannerSheet must be used within a ReorderBannerSheetProvider'
    );

  return context;
};


export function ReorderBannerSheetTrigger(props: Omit<ComponentProps<'button'>, 'onClick'> & VariantProps<typeof buttonVariants>) {

  const { className, variant, size, ...restOfProps } = props;
  const { setIsSheetOpen } = useContext(ReorderBannerSheetContext) ?? {};

  const onClick = () => setIsSheetOpen?.(true);

  return (
    <SlotPrimitive.Slot data-slot="button" onClick={onClick} {...restOfProps}/>
  );
}