import React from "react";
import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { Editor } from "@tiptap/core";
import { useTiptapEditorV2 } from "~/src/hooks/use-tiptap-editor-v2";

/**
 * MathEquationButtonProps is the props for the MathEquationButton component.
 */
interface MathEquationButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
  text?: string;
}

export const MathEquationButton: React.FC<MathEquationButtonProps> = ({
  editor: providedEditor,
  text = "∑",
  ...props
}) => {
  const editor = useTiptapEditorV2({
    editor: providedEditor,
  });

  const handleClick = React.useCallback(() => {
    if (!editor) return;

    editor.editor?.commands.setMathEquation({
      latex: "x^2 + y^2 = z^2", // Default equation
      displayMode: true,
    });
  }, [editor]);

  if (!editor?.editor?.isEditable) {
    return null;
  }

  return (
    <Button
      type="button"
      data-style="ghost"
      role="button"
      tabIndex={-1}
      aria-label="Insert math equation"
      tooltip="Insert math equation"
      onClick={handleClick}
      {...props}
    >
      <span className="tiptap-button-icon">{text}</span>
    </Button>
  );
};
