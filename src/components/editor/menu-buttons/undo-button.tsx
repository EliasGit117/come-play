import { Button } from '@/components/ui/button';
import React, { ComponentProps } from 'react';
import { useCurrentEditor } from '@tiptap/react';
import { Undo2Icon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { tooltipDefaultDelay } from '@/components/editor/consts/menu-item-options';
import { getShortcutKey } from '@/components/editor/utils/get-shortcut-key';

interface IProps extends ComponentProps<typeof Button> {}

const UndoButton = ({ ...props }: IProps) => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  const disabled = !editor.can().undo();

  return (
    <Tooltip delayDuration={tooltipDefaultDelay}>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="smIcon"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled}
          className="transition-none"
          {...props}
        >
          <Undo2Icon />
        </Button>
      </TooltipTrigger>

      <TooltipContent>
        <span>{getShortcutKey('Mod')} + Z</span>
      </TooltipContent>
    </Tooltip>
  );
};

export default UndoButton;
