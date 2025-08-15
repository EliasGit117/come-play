import { Button } from '@/components/ui/button';
import React, { ComponentProps } from 'react';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import { ItalicIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { tooltipDefaultDelay } from '@/components/editor/consts/menu-item-options';
import { getShortcutKey } from '@/components/editor/utils/get-shortcut-key';

interface IProps extends ComponentProps<typeof Button> {}

const ItalicButton = ({ ...props }: IProps) => {
  const { editor } = useCurrentEditor();

  if (!editor)
    return null;

  const state = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        active: ctx.editor.isActive('italic'),
        disabled: !ctx.editor.can().toggleItalic(),
      };
    }
  });

  return (
    <Tooltip delayDuration={tooltipDefaultDelay}>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="smIcon"
          variant={state.active ? 'secondary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={state.disabled}
          className="transition-none"
          {...props}
        >
          <ItalicIcon />
        </Button>
      </TooltipTrigger>

      <TooltipContent>
        <span>{getShortcutKey("Mod")} + I</span>
      </TooltipContent>
    </Tooltip>
  );
};

export default ItalicButton;
