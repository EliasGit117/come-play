import { ComponentProps, FC, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button, buttonVariants } from '@/components/ui/button';
import type { VariantProps } from 'class-variance-authority';
import RoFlag from '@/assets/icons/flags/ro.svg?react'
import RuFlag from '@/assets/icons/flags/ru.svg?react'


interface IProps extends ComponentProps<typeof DropdownMenuTrigger> {
  buttonVariant?: VariantProps<typeof buttonVariants>['variant'];
  buttonSize?: VariantProps<typeof buttonVariants>['size'];
}

const langs = [{ value: 'ro', title: 'Romana' }, { value: 'ru', title: 'Русский' }] as const;
type TLangValue = typeof langs[number]['value'];

const LanguageDropdown: FC<IProps> = ({ buttonVariant, buttonSize, ...props }) => {
  const [lang, setLang] = useState<TLangValue>('ro');

  const handleChange = (value: string) => {
    if (!langs.some(l => l.value === value))
      return;

    setLang(value as TLangValue);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize} {...props}>
          {lang === 'ro' ? <RoFlag className="size-5"/> : <RuFlag className='size-5'/>}
          <span className='sr-only'>Language dropdown</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuRadioGroup value={lang} onValueChange={handleChange}>
          {langs.map(l =>
            <DropdownMenuRadioItem value={l.value} key={l.value}>
              {l.title}
            </DropdownMenuRadioItem>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;