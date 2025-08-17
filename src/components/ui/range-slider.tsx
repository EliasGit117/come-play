'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/use-debounce';
import { useEffect } from 'react';

interface RangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: [number, number];
  onChange?: (values: [number, number]) => void;
  label?: string;
  showTicks?: boolean;
  tickStep?: number;
  debounceTime?: number;
}

const RangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  RangeSliderProps & React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({
     min = 0,
     max = 100,
     step = 1,
     defaultValue = [5, 25],
     onChange,
     label,
     showTicks = false,
     tickStep,
     className,
     debounceTime = 300,
     ...props
   }, ref) => {
  const [value, setValue] = React.useState<[number, number]>(defaultValue);
  const debouncedValue = useDebounce(value, debounceTime);

  useEffect(() => {
    if (!onChange)
      return;

    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  const handleChange = (val: number[]) => {
    const newValue: [number, number] = [val[0], val[1]];
    setValue(newValue);
  };

  const generateTicks = () => {
    const ticks = [];
    const actualTickStep = tickStep || 1; // По умолчанию шаг засечек = 1

    for (let i = min; i <= max; i += actualTickStep) {
      const position = ((i - min) / (max - min)) * 100;
      ticks.push({ value: i, position: position });
    }

    return ticks;
  };

  const ticks = showTicks ? generateTicks() : [];

  return (
    <div className="relative w-full">
      <div className="h-8"/>
      <SliderPrimitive.Root
        ref={ref}
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={handleChange}
        className={cn('relative flex w-full touch-none select-none items-center', className)}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
          <SliderPrimitive.Range className="absolute h-full bg-primary"/>
        </SliderPrimitive.Track>

        <SliderPrimitive.Thumb
          className="block h-4 w-4 rounded-full bg-background border border-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer">
          <Badge variant="outline" className="bg-background absolute left-1/2 -translate-x-1/2 -translate-y-1/2 -top-4">
            {value[0]}
          </Badge>
        </SliderPrimitive.Thumb>

        <SliderPrimitive.Thumb
          className="block h-4 w-4 rounded-full bg-background border border-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer">
          <Badge variant="outline" className="bg-background absolute left-1/2 -translate-x-1/2 -translate-y-1/2 -top-4">
            {value[1]}
          </Badge>
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>

      {showTicks && (
        <div className="relative mt-2 h-6 mx-2">
          {ticks.map((tick) => (
            <div
              key={tick.value}
              className="absolute flex flex-col items-center"
              style={{ left: `${tick.position}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-px h-1.5 bg-muted-foreground/30"/>
              <span className="text-xs text-muted-foreground mt-1 select-none">
                {tick.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

RangeSlider.displayName = 'RangeSlider';

export default RangeSlider;