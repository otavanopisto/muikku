/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { useTiptapEditorV2 } from "~/src/hooks/use-tiptap-editor-v2";
import { MuikkuAnchorModal } from "./MuikkuAnchorModal";
import { OPEN_MUIKKU_ANCHOR_SETTINGS_MODAL_EVENT } from "./MuikkuAnchorExtension";

/**
 * The Muikku anchor button props interface.
 */
export interface MuikkuAnchorButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

/**
 * The Muikku anchor button component.
 * @param props - The props for the Muikku anchor button.
 * @returns The Muikku anchor button component.
 */
export const MuikkuAnchorButton = forwardRef<
  HTMLButtonElement,
  MuikkuAnchorButtonProps
>(({ editor: providedEditor, children, ...buttonProps }, ref) => {
  const { editor } = useTiptapEditorV2({ editor: providedEditor });
  const [open, setOpen] = useState(false);

  // Sets up a listener to open the anchor modal when the anchor settings modal is opened
  useEffect(() => {
    const openModal = () => setOpen(true);
    window.addEventListener(OPEN_MUIKKU_ANCHOR_SETTINGS_MODAL_EVENT, openModal);
    return () =>
      window.removeEventListener(
        OPEN_MUIKKU_ANCHOR_SETTINGS_MODAL_EVENT,
        openModal
      );
  }, []);

  if (!editor?.isEditable) return null;

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        aria-label="Anchor"
        tooltip="Anchor"
        onClick={() => setOpen(true)}
        tabIndex={-1}
        role="button"
        ref={ref}
        {...buttonProps}
      >
        {/* Use any icon you want; emoji keeps it simple */}
        {children ?? <span className="tiptap-button-icon">🚩</span>}
      </Button>

      <MuikkuAnchorModal
        editor={editor}
        opened={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
});
