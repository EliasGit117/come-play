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
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasName = {
  default: 'h-9 w-9 sm:w-fit',
  sm: 'h-8 w-8 sm:w-fit rounded-md gap-1.5 px-3 has-[>svg]:px-2.5'
};

const _ = 'sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden sm:not-sr-only md:not-sr-only';
const AdaptiveButton: FC<ButtonWithTooltipProps> = (props) => {

  const {
    tooltip,
    tooltipDelay = 500,
    text,
    icon: Icon,
    className,
    size = 'default',
    breakpoint = 'sm',
    ...buttonProps
  } = props;

  const textClass = `sr-only ${breakpoint}:not-sr-only`;
  const tooltipClass = `block ${breakpoint}:hidden`;

  return (
    <Tooltip delayDuration={tooltipDelay}>
      <TooltipTrigger asChild>
        <Button
          aria-label={text}
          className={cn(sizeClasName[size], className)}
          {...buttonProps}
        >
          <Icon/>
          <p className={textClass}>{text}</p>
        </Button>
      </TooltipTrigger>
      <TooltipContent className={tooltipClass}>
        <p>{tooltip ?? text}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default AdaptiveButton;
