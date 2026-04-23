/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef } from "react";
import type { Editor } from "@tiptap/react";

import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { useTiptapEditor } from "~/src/hooks/use-tiptap-editor";

/**
 * The Muikku file field button props interface.
 */
export interface MuikkuFileFieldButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

export const MuikkuFileFieldButton = forwardRef<
  HTMLButtonElement,
  MuikkuFileFieldButtonProps
>(({ editor: providedEditor, ...buttonProps }, ref) => {
  const { editor } = useTiptapEditor(providedEditor);

  if (!editor?.isEditable) return null;

  const isActive = editor.isActive("muikkuFileField");

  return (
    <Button
      type="button"
      variant="ghost"
      data-active-state={isActive ? "on" : "off"}
      tooltip="Tiedostokenttä"
      onClick={() => editor.commands.setMuikkuFileField()}
      tabIndex={-1}
      role="button"
      ref={ref}
      {...buttonProps}
    >
      Tiedostokenttä
    </Button>
  );
});

export default MuikkuFileFieldButton;
