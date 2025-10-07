import { Button } from '@/components/ui/button';
import React, { ComponentProps } from 'react';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import { QuoteIcon } from 'lucide-react'; // Using QuoteIcon for blockquote
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { tooltipDefaultDelay } from '@/components/editor/consts/menu-item-options';
import { getShortcutKey } from '@/components/editor/utils/get-shortcut-key';

interface IProps extends ComponentProps<typeof Button> {}

const BlockquoteButton = ({ ...props }: IProps) => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  const state = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        active: ctx.editor.isActive('blockquote'),
        disabled: !ctx.editor.can().toggleBlockquote(),
      };
    },
  });

  return (
    <Tooltip delayDuration={tooltipDefaultDelay}>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon-sm"
          variant={state.active ? 'secondary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={state.disabled}
          className="transition-none"
          {...props}
        >
          <QuoteIcon />
        </Button>
      </TooltipTrigger>

      <TooltipContent>
        <span>{getShortcutKey("Mod")} + Shift + B</span>
      </TooltipContent>
    </Tooltip>
  );
};

export default BlockquoteButton;
