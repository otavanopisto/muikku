/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";

import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import IframeModal from "./IframeModal";
import { useTiptapEditorV2 } from "~/src/hooks/use-tiptap-editor-v2";

const OPEN_EVENT = "muikku:open-iframe-modal";

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

    useEffect(() => {
      const handler = () => setOpen(true);
      window.addEventListener(OPEN_EVENT, handler);
      return () => window.removeEventListener(OPEN_EVENT, handler);
    }, []);

    if (!editor?.isEditable) return null;

    return (
      <>
        <Button
          type="button"
          variant="ghost"
          data-active-state={isActive ? "on" : "off"}
          tooltip="Iframe"
          onClick={() => setOpen(true)}
          tabIndex={-1}
          role="button"
          ref={ref}
          {...buttonProps}
        >
          Iframe
        </Button>

        <IframeModal
          editor={editor}
          opened={open}
          onClose={() => setOpen(false)}
        />
      </>
    );
  }
);

export default IframeButton;
