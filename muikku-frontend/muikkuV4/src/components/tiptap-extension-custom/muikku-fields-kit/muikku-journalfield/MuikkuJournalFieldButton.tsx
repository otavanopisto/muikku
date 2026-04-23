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
 * The Muikku journal field button props interface.
 */
export interface MuikkuJournalFieldButtonProps
  extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

export const MuikkuJournalFieldButton = forwardRef<
  HTMLButtonElement,
  MuikkuJournalFieldButtonProps
>(({ editor: providedEditor, ...buttonProps }, ref) => {
  const { editor } = useTiptapEditor(providedEditor);

  if (!editor?.isEditable) return null;

  const isActive = editor.isActive("muikkuJournalField");

  return (
    <Button
      type="button"
      variant="ghost"
      data-active-state={isActive ? "on" : "off"}
      tooltip="Oppimispäiväkirjakenttä"
      onClick={() => editor.commands.setMuikkuJournalField()}
      tabIndex={-1}
      role="button"
      ref={ref}
      {...buttonProps}
    >
      Oppimispäiväkirjakenttä
    </Button>
  );
});

export default MuikkuJournalFieldButton;
