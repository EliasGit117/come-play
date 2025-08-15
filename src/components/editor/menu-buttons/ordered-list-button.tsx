import { Button } from '@/components/ui/button';
import React, { ComponentProps } from 'react';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import { ListOrderedIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { tooltipDefaultDelay } from '@/components/editor/consts/menu-item-options';
import { getShortcutKey } from '@/components/editor/utils/get-shortcut-key';

interface IProps extends ComponentProps<typeof Button> {}

const OrderedListButton = ({ ...props }: IProps) => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      active: ctx.editor.isActive('orderedList'),
      disabled: !ctx.editor.can().toggleOrderedList(),
    }),
  });

  return (
    <Tooltip delayDuration={tooltipDefaultDelay}>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="smIcon"
          variant={state.active ? 'secondary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={state.disabled}
          className="transition-none"
          {...props}
        >
          <ListOrderedIcon />
        </Button>
      </TooltipTrigger>

      <TooltipContent>
        <span>{getShortcutKey("Mod")} + Shift + 7</span>
      </TooltipContent>
    </Tooltip>
  );
};

export default OrderedListButton;
