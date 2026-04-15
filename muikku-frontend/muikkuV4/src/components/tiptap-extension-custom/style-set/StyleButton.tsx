/* eslint-disable react-x/no-forward-ref */
import * as React from "react";
import { type Editor } from "@tiptap/react";

import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { canApplyStyle, getCurrentStyle } from "./helper";

/**
 * The StyleButtonProps interface
 */
export interface StyleButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
  styleName: string;
  text?: string;
  tooltip?: string;
  className?: string;
}

/**
 * The StyleButton component
 */
export const StyleButton = React.forwardRef<
  HTMLButtonElement,
  StyleButtonProps
>(
  (
    {
      editor: providedEditor,
      styleName,
      text,
      tooltip,
      className = "",
      onClick,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (!editor) return;

        editor.commands.setStyle(styleName);
      },
      [editor, styleName, onClick]
    );

    if (!editor?.isEditable) {
      return null;
    }

    const currentStyle = getCurrentStyle(editor);
    const isActive = currentStyle === styleName;
    const isDisabled = !canApplyStyle(editor);

    return (
      <Button
        ref={ref}
        type="button"
        onClick={handleClick}
        data-style="ghost"
        data-active-state={isActive ? "on" : "off"}
        data-disabled={isDisabled}
        role="button"
        tabIndex={-1}
        aria-label={`Set style to ${styleName}`}
        aria-pressed={isActive}
        tooltip={tooltip ?? styleName}
        className={className}
        disabled={isDisabled}
        {...buttonProps}
      >
        {text ?? styleName}
      </Button>
    );
  }
);

StyleButton.displayName = "StyleButton";
export default StyleButton;
