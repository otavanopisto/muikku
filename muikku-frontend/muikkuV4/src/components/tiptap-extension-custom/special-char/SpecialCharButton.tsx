/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useState } from "react";
import type { Editor } from "@tiptap/react";

import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { useTiptapEditorV2 } from "~/src/hooks/use-tiptap-editor-v2";

import { SpecialCharModal } from "./SpecialCharModal";

/**
 * Props for the SpecialCharButton component.
 */
export interface SpecialCharButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

/**
 * Toolbar button that opens the special character picker modal.
 */
export const SpecialCharButton = forwardRef<
  HTMLButtonElement,
  SpecialCharButtonProps
>(({ editor: providedEditor, children, ...buttonProps }, ref) => {
  const { editor } = useTiptapEditorV2({ editor: providedEditor });
  const [open, setOpen] = useState(false);

  if (!editor?.isEditable) return null;

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        aria-label="Insert special character"
        tooltip="Special character"
        onClick={() => setOpen(true)}
        tabIndex={-1}
        role="button"
        ref={ref}
        {...buttonProps}
      >
        {children ?? (
          <span
            className="tiptap-button-icon"
            aria-hidden="true"
            style={{
              fontSize: 16,
              fontWeight: 600,
              lineHeight: 1,
              fontFamily: "serif",
            }}
          >
            Ω
          </span>
        )}
      </Button>

      <SpecialCharModal
        editor={editor}
        opened={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
});

SpecialCharButton.displayName = "SpecialCharButton";

export default SpecialCharButton;
