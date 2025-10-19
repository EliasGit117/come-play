'use client';

import { ComponentProps, FC } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonWithTooltipProps extends Omit<ComponentProps<typeof Button>, 'size' | 'children'> {
  tooltip?: string;
  tooltipDelay?: number;
  icon: LucideIcon;
  text: string;
  size?: 'sm' | 'default';
}

const sizeClasName = {
  default: 'h-9 w-9 sm:w-fit',
  sm: 'h-8 w-8 sm:w-fit rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
}

const AdaptiveButton: FC<ButtonWithTooltipProps> = (props) => {
  const {
    tooltip,
    tooltipDelay = 500,
    text,
    icon: Icon,
    className,
    size = 'default',
    ...buttonProps
  } = props;

  return (
    <Tooltip delayDuration={tooltipDelay}>
      <TooltipTrigger asChild>
        <Button
          aria-label={text}
          className={cn(sizeClasName[size], className)}
          {...buttonProps}
        >
          <Icon />
          <p className='sr-only sm:not-sr-only'>{text}</p>
        </Button>
      </TooltipTrigger>
      <TooltipContent className='block sm:hidden'>
        <p>{tooltip ?? text}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default AdaptiveButton;
