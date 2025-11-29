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
import { ChevronsUpDownIcon, LanguagesIcon } from 'lucide-react';


interface IProps extends ComponentProps<typeof DropdownMenuTrigger> {
  buttonVariant?: VariantProps<typeof buttonVariants>['variant'];
  align?: 'start' | 'center' | 'end';
}

const langs = [{ value: 'ro', title: 'Romana' }, { value: 'ru', title: 'Русский' }] as const;
type TLangValue = typeof langs[number]['value'];

const LanguageDropdown: FC<IProps> = ({ buttonVariant, align, ...props }) => {
  const [lang, setLang] = useState<TLangValue>('ro');

  const handleChange = (value: string) => {
    if (!langs.some(l => l.value === value))
      return;

    setLang(value as TLangValue);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={buttonVariant} size='sm' {...props}>
          <span className='uppercase sm:hidden'>{lang}</span>

          <LanguagesIcon className='hidden sm:block opacity-65'/>
          <span className='hidden sm:block'>
            {langs.find(item => item.value === lang)?.title}
          </span>
          <ChevronsUpDownIcon className='hidden sm:block opacity-65'/>

          <span className="sr-only">Language dropdown</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-36" align={align}>
        <DropdownMenuLabel className="flex items-center gap-2">
          <LanguagesIcon className="size-4"/>
          <span>Language</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator/>

        <DropdownMenuRadioGroup value={lang} onValueChange={handleChange}>
          {langs.map(({ value, title }) =>
            <DropdownMenuRadioItem
              key={value}
              value={value}
              className="justify-between gap-4"
              onClick={() => setLang(value)}
            >
              <span>{title}</span>
              <span className="text-xs uppercase text-muted-foreground">
                {value}
              </span>
            </DropdownMenuRadioItem>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;