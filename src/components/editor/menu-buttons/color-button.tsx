import React from 'react';
import { useCurrentEditor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { PaletteIcon } from 'lucide-react';

const colors = ['#000000', '#e11d48', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

const ColorButton = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  const currentColor = editor.getAttributes('textStyle').color;

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="smIcon">
          <PaletteIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="grid grid-cols-4 gap-2 p-2 w-auto">
        {colors.map((color) => (
          <DropdownMenuItem
            key={color}
            onSelect={() => setColor(color)}
            className="h-6 w-6 rounded-full p-0"
            style={{
              backgroundColor: color,
              outline: currentColor === color ? '2px solid #000' : 'none',
            }}
          />
        ))}
        <DropdownMenuItem onSelect={() => setColor('')} className="col-span-4 text-xs justify-center text-muted-foreground">
          Reset
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColorButton;
