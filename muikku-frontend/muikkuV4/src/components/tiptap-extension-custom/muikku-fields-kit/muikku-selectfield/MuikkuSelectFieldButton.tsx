/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { useTiptapEditor } from "~/src/hooks/use-tiptap-editor";
import MuikkuSelectFieldModal from "./MuikkuSelectFieldModal";

const OPEN_EVENT = "muikku:open-muikku-selectionfield-modal";

/**
 * The Muikku select field button props interface.
 */
export interface MuikkuSelectFieldButtonProps
  extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

/**
 * The Muikku select field button component.
 * @param props - The props for the Muikku select field button component.
 * @returns The Muikku select field button component.
 */
export const MuikkuSelectFieldButton = forwardRef<
  HTMLButtonElement,
  MuikkuSelectFieldButtonProps
>(({ editor: providedEditor, ...buttonProps }, ref) => {
  const { editor } = useTiptapEditor(providedEditor);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);

  if (!editor?.isEditable) return null;

  const isActive = editor.isActive("muikkuSelectionField");

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        data-active-state={isActive ? "on" : "off"}
        tooltip="Valintakenttä"
        onClick={() => setOpen(true)}
        tabIndex={-1}
        role="button"
        ref={ref}
        {...buttonProps}
      >
        Valintakenttä
      </Button>

      <MuikkuSelectFieldModal
        editor={editor}
        opened={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
});

export default MuikkuSelectFieldButton;
