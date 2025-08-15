import { Button } from '@/components/ui/button';
import React, { ComponentProps } from 'react';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import { BoldIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { tooltipDefaultDelay } from '@/components/editor/consts/menu-item-options';
import { getShortcutKey } from '@/components/editor/utils/get-shortcut-key';


interface IProps extends ComponentProps<typeof Button> {}

const BoldButton = ({ ...props }: IProps) => {
  const { editor } = useCurrentEditor();

  if (!editor)
    return null;

  const state = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        active: ctx.editor.isActive('bold'),
        disabled: !ctx.editor.can().toggleBold(),
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
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={state.disabled}
          className="transition-none"
          {...props}
        >
          <BoldIcon/>
        </Button>
      </TooltipTrigger>

      <TooltipContent>
        <span>{getShortcutKey("Mod")} + B</span>
      </TooltipContent>
    </Tooltip>
  );
};


export default BoldButton;
