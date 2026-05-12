/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useState } from "react";
import type { Editor } from "@tiptap/react";

import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { IframeModal } from "./IframeModal";
import { useTiptapEditorV2 } from "@/hooks/use-tiptap-editor-v2";
import { useCallbackOnEvent } from "@/hooks/use-callback-on-event";
import { OPEN_EVENT } from "./IframeExtension";

/**
 * The IframeButtonProps interface.
 */
export interface IframeButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

/**
 * The IframeButton component.
 * @param props - The props for the IframeButton component.
 * @returns The IframeButton component.
 */
export const IframeButton = forwardRef<HTMLButtonElement, IframeButtonProps>(
  ({ editor: providedEditor, ...buttonProps }, ref) => {
    const { editor, selected } = useTiptapEditorV2({
      editor: providedEditor,
      selector: ({ editor }) => editor.isActive("iframe"),
    });
    const isActive = !!selected;
    const [open, setOpen] = useState(false);

    useCallbackOnEvent(OPEN_EVENT, () => setOpen(true));

    /**
     * The handleOpenClick function.
     */
    const handleOpenClick = () => {
      setOpen(true);
    };

    /**
     * The handleCloseClick function.
     */
    const handleCloseClick = () => {
      setOpen(false);
    };

    if (!editor?.isEditable) return null;

    return (
      <>
        <Button
          type="button"
          variant="ghost"
          data-active-state={isActive ? "on" : "off"}
          tooltip="Iframe"
          onClick={handleOpenClick}
          tabIndex={-1}
          role="button"
          ref={ref}
          {...buttonProps}
        >
          Iframe
        </Button>

        <IframeModal editor={editor} opened={open} onClose={handleCloseClick} />
      </>
    );
  }
);
