import { Color } from '@tiptap/extension-color';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align'
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import React, { FC } from 'react';
import BoldButton from '@/components/editor/menu-buttons/bold-button';
import ItalicButton from '@/components/editor/menu-buttons/italic-button';
import StrikeButton from '@/components/editor/menu-buttons/strike-button';
import UndoButton from '@/components/editor/menu-buttons/undo-button';
import RedoButton from '@/components/editor/menu-buttons/redo-button';
import { Separator } from '@/components/ui/separator';
import TextTypeDropdown from '@/components/editor/menu-buttons/text-type-dropdown';
import UnderlineButton from '@/components/editor/menu-buttons/ubderline-button';
import ColorButton from '@/components/editor/menu-buttons/color-button';
import HighlightButton from '@/components/editor/menu-buttons/highlight-color-button';
import BlockquoteButton from '@/components/editor/menu-buttons/blockquote-button';
import BulletListButton from '@/components/editor/menu-buttons/bullet-list-button';
import OrderedListButton from '@/components/editor/menu-buttons/ordered-list-button';
import CodeBlockButton from '@/components/editor/menu-buttons/codeblock-button';
import HorizontalRuleButton from '@/components/editor/menu-buttons/horrizontal-rule-button';
import AlignDropdown from '@/components/editor/menu-buttons/align-dropdown';
import LinkButton from '@/components/editor/menu-buttons/link-button';
import { cn } from '@/lib/utils';

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="sticky top-0 bg-background z-10 p-1 rounded-t-lg border-b">
      <div className="flex flex-wrap gap-1 items-center">
        <UndoButton/>
        <RedoButton/>
        <Separator orientation="vertical" className="!h-6"/>
        <TextTypeDropdown/>
        <Separator orientation="vertical" className="!h-6"/>
        <BoldButton/>
        <ItalicButton/>
        <UnderlineButton/>
        <StrikeButton/>
        <Separator orientation="vertical" className="!h-6"/>
        <ColorButton/>
        <HighlightButton/>
        <Separator orientation="vertical" className="!h-6"/>
        <AlignDropdown/>
        <BulletListButton/>
        <OrderedListButton/>
        <BlockquoteButton/>
        <CodeBlockButton/>
        <HorizontalRuleButton/>
        <LinkButton/>
      </div>
    </div>
  );
};

const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false
    },
    blockquote: {},
    link: { openOnClick: false },
  }),
  TextStyle,
  Color,
  Highlight,
  Youtube,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
    alignments: ['left', 'center', 'right', 'justify'],
  }),
];



interface IRichEditorProps {
  value: string;
  onChange: (content: string) => void;
  className?: string;
  editorClassName?: string;
}

const RichEditor: FC<IRichEditorProps> = ({ value, onChange, className, editorClassName }) => {

  return (
    <div className={cn("border rounded-lg bg-transparent dark:bg-input/30 min-h-[259px]", className)}>
      <EditorProvider
        immediatelyRender={false}
        slotBefore={<MenuBar/>}
        extensions={extensions}
        content={value}
        onUpdate={({ editor }) => {
          const html = editor.getHTML();
          onChange(html);
        }}
        editorProps={{
          attributes: {
            class: cn(
              'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl m-5 focus:outline-none max-w-4xl',
              editorClassName
            )
          }
        }}
      />
    </div>
  );
}

export default RichEditor;
