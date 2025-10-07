import { Button } from '@/components/ui/button';
import React, { ComponentProps } from 'react';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import { Minus } from 'lucide-react';
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip';
import { tooltipDefaultDelay } from '@/components/editor/consts/menu-item-options';

interface IProps extends ComponentProps<typeof Button> {
}

const HorizontalRuleButton = ({ ...props }: IProps) => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      // horizontal rule doesn’t have active state, so disabled if can insert or not
      disabled: !ctx.editor.can().setHorizontalRule()
    })
  });

  return (
    <Tooltip delayDuration={tooltipDefaultDelay}>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          disabled={state.disabled}
          className="transition-none"
          {...props}
        >
          <Minus/>
        </Button>
      </TooltipTrigger>
    </Tooltip>
  );
};

export default HorizontalRuleButton;
