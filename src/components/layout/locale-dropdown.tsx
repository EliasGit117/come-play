import { IconLanguage, IconSelector } from '@tabler/icons-react';
import { ComponentProps, FC, useState } from 'react';
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
import type { VariantProps } from 'class-variance-authority';
import { getLocale, isLocale, Locale, setLocale } from '@/paraglide/runtime';



interface IProps extends ComponentProps<typeof DropdownMenuTrigger> {
  buttonVariant?: VariantProps<typeof buttonVariants>['variant'];
  align?: 'start' | 'center' | 'end';
}

const options: { value: Locale; title: string; }[] = [{ value: 'ro', title: 'Romana' }, { value: 'ru', title: 'Русский' }];

const LocaleDropdown: FC<IProps> = ({ buttonVariant, align, ...props }) => {
  const locale = getLocale();

  const handleChange = (value: string) => {
    if (!isLocale(value))
      return;

    setLocale(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={buttonVariant} size='sm' {...props}>
          <span className='uppercase sm:hidden'>{locale}</span>

          <IconLanguage className='hidden sm:block opacity-65'/>
          <span className='hidden sm:block'>
            {options.find(item => item.value === locale)?.title}
          </span>
          <IconSelector className='hidden sm:block opacity-65'/>

          <span className="sr-only">Language dropdown</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-36" align={align}>
        <DropdownMenuLabel className="flex items-center gap-2">
          <IconLanguage className="size-4"/>
          <span>Language</span>
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