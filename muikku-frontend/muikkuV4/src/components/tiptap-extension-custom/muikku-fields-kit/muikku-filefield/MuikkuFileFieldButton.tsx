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
    selector: ({ editor }) => ({
      isActive: editor.isActive("muikkuFileField"),
    }),
  });
  const isActive = selected?.isActive ?? false;

  if (!editor?.isEditable) return null;

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
