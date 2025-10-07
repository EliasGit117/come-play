import { Button } from '@/components/ui/button';
import React, { ComponentProps } from 'react';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { tooltipDefaultDelay } from '@/components/editor/consts/menu-item-options';
import { getShortcutKey } from '@/components/editor/utils/get-shortcut-key';
import { ListIcon } from 'lucide-react';

interface IProps extends ComponentProps<typeof Button> {
}

const BulletListButton = ({ ...props }: IProps) => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      active: ctx.editor.isActive('bulletList'),
      disabled: !ctx.editor.can().toggleBulletList()
    })
  });

  return (
    <Tooltip delayDuration={tooltipDefaultDelay}>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon-sm"
          variant={state.active ? 'secondary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={state.disabled}
          className="transition-none"
          {...props}
        >
          <ListIcon/>
        </Button>
      </TooltipTrigger>

      <TooltipContent>
        <span>{getShortcutKey('Mod')} + Shift + 8</span>
      </TooltipContent>
    </Tooltip>
  );
};

export default BulletListButton;
