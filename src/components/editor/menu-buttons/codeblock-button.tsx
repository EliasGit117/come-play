import { Button } from '@/components/ui/button';
import React, { ComponentProps } from 'react';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import { CodeIcon } from 'lucide-react';
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip';
import { tooltipDefaultDelay } from '@/components/editor/consts/menu-item-options';



interface IProps extends ComponentProps<typeof Button> {}

const CodeBlockButton = ({ ...props }: IProps) => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      active: ctx.editor.isActive('codeBlock'),
      disabled: !ctx.editor.can().setNode('codeBlock'),
    }),
  });

  return (
    <Tooltip delayDuration={tooltipDefaultDelay}>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="smIcon"
          variant={state.active ? 'secondary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          disabled={state.disabled}
          className="transition-none"
          {...props}
        >
          <CodeIcon />
        </Button>
      </TooltipTrigger>

      {/*<TooltipContent>*/}
      {/*  <span>{getShortcutKey('Mod')} + Shift + C</span>*/}
      {/*</TooltipContent>*/}
    </Tooltip>
  );
};

export default CodeBlockButton;
