/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { useTiptapEditor } from "~/src/hooks/use-tiptap-editor";
import MuikkuMemoFieldModal from "./MuikkuMemoFieldModal";

const OPEN_EVENT = "muikku:open-muikku-memofield-modal";

/**
 * The Muikku memo field button props interface.
 */
export interface MuikkuMemoFieldButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

/**
 * The Muikku memo field button component.
 * @param props - The props for the Muikku memo field button component.
 * @returns The Muikku memo field button component.
 */
export const MuikkuMemoFieldButton = forwardRef<
  HTMLButtonElement,
  MuikkuMemoFieldButtonProps
>(({ editor: providedEditor, ...buttonProps }, ref) => {
  const { editor } = useTiptapEditor(providedEditor);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);

  if (!editor?.isEditable) return null;

  const isActive = editor.isActive("muikkuMemoField");

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        data-active-state={isActive ? "on" : "off"}
        tooltip="Muistiokenttä"
        onClick={() => setOpen(true)}
        tabIndex={-1}
        role="button"
        ref={ref}
        {...buttonProps}
      >
        Muistiokenttä
      </Button>

      <MuikkuMemoFieldModal
        editor={editor}
        opened={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
});

export default MuikkuMemoFieldButton;
