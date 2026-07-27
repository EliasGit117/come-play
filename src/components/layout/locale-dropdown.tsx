import { IconLanguage } from '@tabler/icons-react';
import { ComponentProps, FC } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import { getLocale, isLocale, Locale, setLocale } from '@/paraglide/runtime';
import { m } from '@/paraglide/messages';



interface IProps extends ComponentProps<typeof DropdownMenuTrigger> {
  buttonVariant?: VariantProps<typeof buttonVariants>['variant'];
  align?: 'start' | 'center' | 'end';
}

const options: { value: Locale; title: string; }[] = [{ value: 'ro', title: 'RO' }, { value: 'ru', title: 'RU' }];

const LocaleDropdown: FC<IProps> = ({ buttonVariant, align, className, ...props }) => {
  const locale = getLocale();

  const handleChange = (value: string) => {
    if (!isLocale(value))
      return;

    setLocale(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={buttonVariant} size='icon-sm' className={cn('transition-none', className)} {...props}>
          <span className='uppercase text-xs'>{locale}</span>
          <span className="sr-only">{m['layout.locale.sr_toggle']()}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-fit min-w-24" align={align}>
        <DropdownMenuLabel className="flex items-center gap-2">
          <IconLanguage className="size-4"/>
          <span>{m['layout.locale.label']()}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator/>

        <DropdownMenuRadioGroup value={locale} onValueChange={handleChange}>
          {options.map(({ value, title }) =>
            <DropdownMenuRadioItem key={value} value={value}>
              <span className="text-xs uppercase text-muted-foreground">
                {value}
              </span>
              <span>{title}</span>
            </DropdownMenuRadioItem>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocaleDropdown;