/* eslint-disable react-x/no-forward-ref */
"use client";

import type { Editor } from "@tiptap/react";

import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { canUseDivBox, getCurrentDivBoxPreset } from "./helper";
import { forwardRef, useCallback } from "react";

/**
 * The DivBoxPresetButtonProps interface.
 */
interface DivBoxPresetButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
  styleName: string;
  tooltip?: string;
  className?: string;
  text?: string;
}

/**
 * The DivBoxPresetButton component.
 * @param props - The props for the DivBoxPresetButton component.
 * @returns The DivBoxPresetButton component.
 */
export const DivBoxPresetButton = forwardRef<
  HTMLButtonElement,
  DivBoxPresetButtonProps
>(
  (
    {
      editor: providedEditor,
      styleName,
      tooltip,
      className,
      text,
      onClick,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (!editor) return;
        editor.commands.setDivBoxPreset(styleName);
      },
      [editor, styleName, onClick]
    );

    if (!editor?.isEditable) {
      return null;
    }

    const currentPreset = getCurrentDivBoxPreset(editor);
    const isActive = currentPreset === styleName;
    const isDisabled = !canUseDivBox(editor);

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
        aria-label={`Set div box style to ${styleName}`}
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
