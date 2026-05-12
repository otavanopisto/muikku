"use client";

/* eslint-disable react-x/no-forward-ref */
import { forwardRef, useCallback } from "react";
import type { Editor } from "@tiptap/react";

import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { useTiptapEditorV2 } from "~/src/hooks/use-tiptap-editor-v2";

import { sourceModePluginKey } from "./SourceModeExtension";

/**
 * The SourceModeButtonProps interface.
 * @extends Omit<ButtonProps, "type">
 */
export interface SourceModeButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

export const SourceModeButton = forwardRef<
  HTMLButtonElement,
  SourceModeButtonProps
>(({ editor: providedEditor, onClick, children, ...props }, ref) => {
  const { editor, selected } = useTiptapEditorV2({
    editor: providedEditor,
    selector: ({ editor }) =>
      sourceModePluginKey.getState(editor.state)?.enabled,
  });

  const enabled = !!selected;

  const canToggle =
    !!editor?.isEditable &&
    typeof editor?.commands?.toggleSourceMode === "function";

  /**
   * The handleClick function.
   * @param e - The event.
   */
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      if (!canToggle) return;
      editor.commands.toggleSourceMode();
    },
    [onClick, canToggle, editor]
  );

  if (!editor?.isEditable) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={!canToggle}
      data-disabled={!canToggle}
      data-active-state={enabled ? "on" : "off"}
      aria-label="HTML source"
      tooltip="HTML"
      tabIndex={-1}
      role="button"
      onClick={handleClick}
      ref={ref}
      {...props}
    >
      {children ?? "HTML"}
    </Button>
  );
});
