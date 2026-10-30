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
 * The Muikku file field button props interface.
 */
export interface MuikkuFileFieldButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

export const MuikkuFileFieldButton = forwardRef<
  HTMLButtonElement,
  MuikkuFileFieldButtonProps
>(({ editor: providedEditor, ...buttonProps }, ref) => {
  const { editor, selected } = useTiptapEditorV2({
    editor: providedEditor,
    selector: ({ editor: instance }) => ({
      isActive: instance.isActive("muikkuFileField"),
      isDisabled: !instance.isEditable,
    }),
  });
  const isActive = selected?.isActive ?? false;
  const isDisabled = selected?.isDisabled ?? false;

  /**
   * The handleSetFileFieldClick function.
   */
  const handleSetFileFieldClick = () => {
    if (!editor) return;
    editor.commands.setMuikkuFileField();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      data-active-state={isActive ? "on" : "off"}
      tooltip="Tiedostokenttä"
      onClick={handleSetFileFieldClick}
      tabIndex={-1}
      role="button"
      ref={ref}
      disabled={isDisabled}
      data-disabled={isDisabled}
      {...buttonProps}
    >
      Tiedostokenttä
    </Button>
  );
});
