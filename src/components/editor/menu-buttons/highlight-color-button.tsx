import React from 'react';
import { useCurrentEditor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { HighlighterIcon } from 'lucide-react';

const highlights = ['#fef08a', '#fde68a', '#a7f3d0', '#e0e7ff', '#fcd34d', '#fca5a5'];

const HighlightButton = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  const currentColor = editor.getAttributes('highlight').color;

  const setHighlight = (color: string) => {
    editor.chain().focus().setHighlight({ color }).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" type="button">
          <HighlighterIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="grid grid-cols-4 gap-2 p-2 w-auto">
        {highlights.map((color) => (
          <DropdownMenuItem
            key={color}
            onSelect={() => setHighlight(color)}
            className="h-6 w-6 rounded-full p-0"
            style={{
              backgroundColor: color,
              outline: currentColor === color ? '2px solid #000' : 'none',
            }}
          />
        ))}
        <DropdownMenuItem
          onSelect={() => editor.chain().focus().unsetHighlight().run()}
          className="col-span-4 text-xs justify-center bg-muted"
        >
          Reset
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HighlightButton;
