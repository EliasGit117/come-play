'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon
} from 'lucide-react';
import { useCurrentEditor } from '@tiptap/react';

const alignOptions = [
  { label: 'Left', value: 'left', icon: AlignLeftIcon, shortcut: '⌘⇧L' },
  { label: 'Center', value: 'center', icon: AlignCenterIcon, shortcut: '⌘⇧E' },
  { label: 'Right', value: 'right', icon: AlignRightIcon, shortcut: '⌘⇧R' },
  { label: 'Justify', value: 'justify', icon: AlignJustifyIcon, shortcut: '⌘⇧J' }
];

const AlignDropdown = () => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <AlignLeftIcon className="w-4 h-4"/>
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
