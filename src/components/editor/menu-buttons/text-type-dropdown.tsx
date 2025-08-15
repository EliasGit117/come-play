import { useCurrentEditor } from '@tiptap/react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon } from 'lucide-react';
import React from 'react';
import { getShortcutKey } from '@/components/editor/utils/get-shortcut-key';
import { Level } from '@tiptap/extension-heading';

const levels: Level[] = [1, 2, 3, 4, 5, 6];

const textStyles = [
  {
    label: 'Paragraph',
    command: 'paragraph',
    level: undefined,
    shortcut: `${getShortcutKey('Mod')} + Alt + 0`
  },
  ...levels.map((level) => ({
    label: `Heading ${level}`,
    command: 'heading',
    level,
    shortcut: `${getShortcutKey('Mod')} + Alt + ${level}`
  }))
];

const TextStyleDropdown = () => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  const isActiveStyle = (style: (typeof textStyles)[number]) => {
    if (style.command === 'paragraph') return editor.isActive('paragraph');
    return editor.isActive('heading', { level: style.level });
  };

  const getCurrentLabel = () => {
    const current = textStyles.find(isActiveStyle);
    return current?.label || 'Text';
  };

  const handleSelect = (style: (typeof textStyles)[number]) => {
    if (!editor)
      return;

    if (style.command === 'paragraph') {
      editor.chain().focus().setParagraph().run();
    } else {

      if (!style.level)
        return;

      editor.chain().focus().toggleHeading({ level: style.level }).run();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 font-normal">
          {getCurrentLabel()}
          <ChevronDownIcon className="w-4 h-4"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {textStyles.map((style) => (
          <DropdownMenuItem
            key={style.label}
            data-active={isActiveStyle(style)}
            onSelect={() => handleSelect(style)}
            className="flex justify-between items-center group text-muted-foreground"
          >
            <span className="flex items-center gap-2 group-data-[active=true]:text-foreground group-data-[active=true]:font-bold">
              {style.label}
            </span>
            <span className="ml-4 text-xs">
              {style.shortcut}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TextStyleDropdown;
