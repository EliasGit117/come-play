import { Button } from '@/components/ui/button';
import React, { ComponentProps } from 'react';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import { StrikethroughIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { tooltipDefaultDelay } from '@/components/editor/consts/menu-item-options';
import { getShortcutKey } from '@/components/editor/utils/get-shortcut-key';

interface IProps extends ComponentProps<typeof Button> {}

const StrikeButton = ({ ...props }: IProps) => {
  const { editor } = useCurrentEditor();

  if (!editor)
    return null;

  const state = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        active: ctx.editor.isActive('strike'),
        disabled: !ctx.editor.can().toggleStrike(),
      };
    }
  });

  return (
    <Tooltip delayDuration={tooltipDefaultDelay}>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon-sm"
          variant={state.active ? 'secondary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={state.disabled}
          className="transition-none"
          {...props}
        >
          <StrikethroughIcon />
        </Button>
      </TooltipTrigger>

      <TooltipContent>
        <span>{getShortcutKey("Mod")} + Shift + X</span>
      </TooltipContent>
    </Tooltip>
  );
};

export default StrikeButton;
