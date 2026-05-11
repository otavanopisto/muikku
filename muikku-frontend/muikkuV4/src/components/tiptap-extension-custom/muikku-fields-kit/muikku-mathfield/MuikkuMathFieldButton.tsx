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
 * The Muikku math field button props interface.
 */
export interface MuikkuMathFieldButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

export const MuikkuMathFieldButton = forwardRef<
  HTMLButtonElement,
  MuikkuMathFieldButtonProps
>(({ editor: providedEditor, ...buttonProps }, ref) => {
  const { editor, selected } = useTiptapEditorV2({
    editor: providedEditor,
    selector: ({ editor }) => ({
      isActive: editor.isActive("muikkuMathField"),
    }),
  });
  const isActive = selected?.isActive ?? false;

  if (!editor?.isEditable) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      data-active-state={isActive ? "on" : "off"}
      tooltip="Matematiikkatehtäväkenttä"
      onClick={() => editor.commands.setMuikkuMathField()}
      tabIndex={-1}
      role="button"
      ref={ref}
      {...buttonProps}
    >
      Matematiikkatehtäväkenttä
    </Button>
  );
});
