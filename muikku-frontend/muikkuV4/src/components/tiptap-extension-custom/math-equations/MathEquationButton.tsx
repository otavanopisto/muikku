import React from "react";
import { Button } from "@/components/tiptap-ui-primitive/button";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { Editor } from "@tiptap/core";

/**
 * MathEquationButtonProps is the props for the MathEquationButton component.
 */
interface MathEquationButtonProps {
  editor?: Editor | null;
  text?: string;
}

export const MathEquationButton: React.FC<MathEquationButtonProps> = ({
  editor: providedEditor,
  text,
}) => {
  const editor = useTiptapEditor(providedEditor);

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
    >
      <span className="tiptap-button-icon">∑</span>
    </Button>
  );
};
