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
  const { editor, selected } = useTiptapEditorV2({
    editor: providedEditor,
    selector: ({ editor: instance }) => ({
      canUse: !!instance.isEditable,
    }),
  });
  const [open, setOpen] = useState(false);

  const canUse = selected?.canUse ?? false;

  /**
   * The handleClick function.
   * @param e - The event.
   */
  const handleOpenClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpen(true);
  };

  /**
   * The handleClose function.
   */
  const handleCloseClick = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        aria-label="Insert special character"
        tooltip="Special character"
        onClick={handleOpenClick}
        tabIndex={-1}
        role="button"
        ref={ref}
        disabled={!canUse}
        data-disabled={!canUse}
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
        onClose={handleCloseClick}
      />
    </>
  );
});
