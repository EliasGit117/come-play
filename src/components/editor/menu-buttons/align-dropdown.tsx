import { IconAlignCenter, IconAlignJustified, IconAlignLeft, IconAlignRight } from '@tabler/icons-react';
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import { useCurrentEditor } from '@tiptap/react';

const alignOptions = [
  { label: 'Left', value: 'left', icon: IconAlignLeft, shortcut: '⌘⇧L' },
  { label: 'Center', value: 'center', icon: IconAlignCenter, shortcut: '⌘⇧E' },
  { label: 'Right', value: 'right', icon: IconAlignRight, shortcut: '⌘⇧R' },
  { label: 'Justify', value: 'justify', icon: IconAlignJustified, shortcut: '⌘⇧J' }
];

const AlignDropdown = () => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <IconAlignLeft className="w-4 h-4"/>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-44">
        {alignOptions.map(({ label, value, icon: Icon, shortcut }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => editor.chain().focus().setTextAlign(value).run()}
          >
            <Icon className="mr-2 h-4 w-4"/>
            <span className="flex-1">{label}</span>
            <kbd className="text-xs text-muted-foreground">{shortcut}</kbd>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AlignDropdown;
