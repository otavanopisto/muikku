/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { DivFrameModal } from "./DivFrameModal";
import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { useTiptapEditor } from "~/src/hooks/use-tiptap-editor";

/**
 * The DivFrameToolbarButtonProps interface.
 */
export interface DivFrameToolbarButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

/**
 * The DivFrameToolbarButton component.
 * @param editor - The editor.
 * @returns The DivFrameToolbarButton component.
 */
export const DivFrameToolbarButton = forwardRef<
  HTMLButtonElement,
  DivFrameToolbarButtonProps
>(({ editor: providedEditor, ...buttonProps }, ref) => {
  const [open, setOpen] = useState(false);
  const { editor } = useTiptapEditor(providedEditor);

  if (!editor?.isEditable) {
    return null;
  }

  return (
    <>
      <Button
        size="small"
        variant="ghost"
        onClick={() => setOpen(true)}
        ref={ref}
        {...buttonProps}
      >
        Div
      </Button>
      <DivFrameModal
        editor={editor}
        opened={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
});
