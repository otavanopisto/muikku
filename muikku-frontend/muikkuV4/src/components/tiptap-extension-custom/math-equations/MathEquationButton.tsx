/* eslint-disable react-x/no-forward-ref */
import React, { forwardRef } from "react";
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

/**
 * The MathEquationButton component.
 * @param props - The props for the MathEquationButton component.
 * @returns The MathEquationButton component.
 */
export const MathEquationButton = forwardRef<
  HTMLButtonElement,
  MathEquationButtonProps
>(({ editor: providedEditor, text = "∑", ...props }, ref) => {
  const { editor } = useTiptapEditorV2({
    editor: providedEditor,
  });

  /**
   * Handles the click event of the MathEquationButton component.
   */
  const handleClick = React.useCallback(() => {
    if (!editor) return;

    editor?.commands.setMathEquation({
      latex: "x^2 + y^2 = z^2", // Default equation
      displayMode: true,
    });
  }, [editor]);

  if (!editor?.isEditable) {
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
      ref={ref}
      {...props}
    >
      <span className="tiptap-button-icon">{text}</span>
    </Button>
  );
});
