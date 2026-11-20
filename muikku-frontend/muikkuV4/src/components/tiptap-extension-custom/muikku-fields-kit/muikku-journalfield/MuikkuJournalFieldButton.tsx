/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef } from "react";
import type { Editor } from "@tiptap/react";
import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { useTiptapEditorV2 } from "~/src/hooks/use-tiptap-editor-v2";

/**
 * The Muikku journal field button props interface.
 */
export interface MuikkuJournalFieldButtonProps extends Omit<
  ButtonProps,
  "type"
> {
  editor?: Editor | null;
}

export const MuikkuJournalFieldButton = forwardRef<
  HTMLButtonElement,
  MuikkuJournalFieldButtonProps
>(({ editor: providedEditor, ...buttonProps }, ref) => {
  const { editor, selected } = useTiptapEditorV2({
    editor: providedEditor,
    selector: ({ editor: instance }) => ({
      isDisabled: !instance.isEditable,
      isActive: instance.isActive("muikkuJournalField"),
    }),
  });
  const isActive = selected?.isActive ?? false;
  const isDisabled = selected?.isDisabled ?? false;

  /**
   * The handleSetJournalFieldClick function.
   */
  const handleSetJournalFieldClick = () => {
    if (!editor) return;
    editor.commands.setMuikkuJournalField();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      data-active-state={isActive ? "on" : "off"}
      tooltip="Oppimispäiväkirjakenttä"
      onClick={handleSetJournalFieldClick}
      tabIndex={-1}
      role="button"
      ref={ref}
      disabled={isDisabled}
      data-disabled={isDisabled}
      {...buttonProps}
    >
      Oppimispäiväkirjakenttä
    </Button>
  );
});
