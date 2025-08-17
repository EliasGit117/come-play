'use client';

import { ComponentProps, FC, ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface ButtonWithTooltipProps extends ComponentProps<typeof Button> {
  tooltip: string;
  children: ReactNode;
  delayDuration?: number;
}

const ButtonWithTooltip: FC<ButtonWithTooltipProps> = (props) => {
  const {
    tooltip,
    children,
    delayDuration = 500,
    ...buttonProps
  } = props;

  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>
        <Button {...buttonProps}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ButtonWithTooltip;
