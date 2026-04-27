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
 * The Muikku audio field button props interface.
 */
export interface MuikkuAudioFieldButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

/**
 * The Muikku audio field button component.
 * @param props - The props for the Muikku audio field button component.
 * @returns The Muikku audio field button component.
 */
export const MuikkuAudioFieldButton = forwardRef<
  HTMLButtonElement,
  MuikkuAudioFieldButtonProps
>(({ editor: providedEditor, ...buttonProps }, ref) => {
  const { editor, selected } = useTiptapEditorV2({
    editor: providedEditor,
    selector: ({ editor }) => ({
      isActive: editor.isActive("muikkuAudioField"),
    }),
  });
  const isActive = selected?.isActive ?? false;

  if (!editor?.isEditable) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      data-active-state={isActive ? "on" : "off"}
      tooltip="Äänikenttä"
      onClick={() => editor.commands.setMuikkuAudioField()}
      tabIndex={-1}
      role="button"
      ref={ref}
      {...buttonProps}
    >
      Äänikenttä
    </Button>
  );
});

export default MuikkuAudioFieldButton;
