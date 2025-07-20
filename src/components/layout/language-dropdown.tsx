import { ComponentProps, FC, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button, buttonVariants } from '@/components/ui/button';
import type { VariantProps } from 'class-variance-authority';

interface IProps extends ComponentProps<'article'> {
  buttonVariant?: VariantProps<typeof buttonVariants>['variant'];
  buttonSize?: VariantProps<typeof buttonVariants>['size'];
}

const langs = [{ value: 'ro', title: 'Romana', flag: '🇷🇴' }, { value: 'ru', title: 'Русский', flag: '🇷🇺' }] as const;
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
        <Button variant={buttonVariant} size={buttonSize} className="">
          {lang === 'ro' ? (
            <>
            <img src="/public/icons/flags/ro.svg" alt="ro-flag" className="h-3.5"/>
            </>
          ) : (
            <img src="/public/icons/flags/ru.svg" alt="ro-flag" className="h-3.5 border border-black/25"/>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuRadioGroup value={lang} onValueChange={handleChange}>
          {langs.map(l =>
            <DropdownMenuRadioItem value={l.value}>
              {l.title}
            </DropdownMenuRadioItem>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;