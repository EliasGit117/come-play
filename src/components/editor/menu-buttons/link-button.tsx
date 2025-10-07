'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCurrentEditor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { LinkIcon, Edit2Icon, TrashIcon, PlusIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { getShortcutKey } from '@/components/editor/utils/get-shortcut-key';
import { tooltipDefaultDelay } from '@/components/editor/consts/menu-item-options';

const LinkButton = () => {
  const { editor } = useCurrentEditor();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const isActive = editor.isActive('link');
  const canToggle = editor.can().toggleLink({ href: 'https://example.com' });

  // Sync input with current link URL on open
  useEffect(() => {
    if (open && isActive) {
      setUrl(editor.getAttributes('link').href || '');
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
    if (!open) {
      setUrl('');
    }
  }, [open, isActive, editor]);

  const applyLink = () => {
    if (url.trim() === '') {
      editor.chain().focus().unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url.trim() })
        .run();
    }
    setOpen(false);
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
    setOpen(false);
  };

  const togglePopover = () => {
    setOpen(!open);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip delayDuration={tooltipDefaultDelay}>
        <PopoverTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={isActive ? 'secondary' : 'ghost'}
              size="icon-sm"
              onClick={togglePopover}
              disabled={!canToggle}
              aria-label={isActive ? 'Edit Link' : 'Add Link'}
            >
              <LinkIcon className="w-4 h-4"/>
            </Button>
          </TooltipTrigger>
        </PopoverTrigger>
        <TooltipContent>
          <span>{getShortcutKey('Mod')} + K</span>
        </TooltipContent>
      </Tooltip>

      <PopoverContent className="w-[260px] p-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="link-url" className="text-sm font-medium">
            {isActive ? 'Edit Link URL' : 'Add Link URL'}
          </label>
          <Input
            id="link-url"
            ref={inputRef}
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                applyLink();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                setOpen(false);
              }
            }}
          />

          <div className="flex justify-end gap-2 pt-2">
            {isActive && (
              <Button
                variant="destructive"
                size="sm"
                onClick={removeLink}
                aria-label="Remove link"
                title="Remove link"
              >
                <TrashIcon className="w-4 h-4"/>
              </Button>
            )}

            <Button
              size="sm"
              onClick={applyLink}
              disabled={url.trim() === ''}
              aria-label="Apply link"
              title="Apply link"
            >
              {
                !isActive ?
                  <>
                    <PlusIcon/>
                    <span>Add</span>
                  </> :
                  <>
                    <Edit2Icon/>
                    <span>Update</span>
                  </>
              }
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LinkButton;
