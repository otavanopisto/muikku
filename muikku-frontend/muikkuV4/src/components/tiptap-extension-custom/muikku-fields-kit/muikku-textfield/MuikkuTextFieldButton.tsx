/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";

import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { MuikkuTextFieldModal } from "./MuikkuTextFieldModal";
import { useTiptapEditorV2 } from "~/src/hooks/use-tiptap-editor-v2";
import { OPEN_EVENT } from "./MuikkuTextFieldExtension";

/**
 * The Muikku text field button props interface.
 */
export interface MuikkuTextFieldButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

/**
 * The Muikku text field button component.
 * @param props - The props for the Muikku text field button component.
 * @returns The Muikku text field button component.
 */
export const MuikkuTextFieldButton = forwardRef<
  HTMLButtonElement,
  MuikkuTextFieldButtonProps
>(({ editor: providedEditor, ...buttonProps }, ref) => {
  const { editor, selected } = useTiptapEditorV2({
    editor: providedEditor,
    selector: ({ editor }) => ({
      isActive: editor.isActive("muikkuTextField"),
    }),
  });
  const isActive = selected?.isActive ?? false;
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
        tooltip="Tekstikenttä"
        onClick={() => setOpen(true)}
        tabIndex={-1}
        role="button"
        ref={ref}
        {...buttonProps}
      >
        Tekstikenttä
      </Button>

      <MuikkuTextFieldModal
        editor={editor}
        opened={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
});
