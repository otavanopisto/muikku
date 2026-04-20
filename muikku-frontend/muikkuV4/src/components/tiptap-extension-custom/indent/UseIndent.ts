"use client";

import { useCallback, useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";

import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { isExtensionAvailable, isNodeTypeSelected } from "@/lib/tiptap-utils";

import { IndentIncreaseIcon } from "@/components/tiptap-icons/indent-increase-icon";
import { IndentDecreaseIcon } from "@/components/tiptap-icons/indent-decrease-icon";

export type IndentAction = "increase" | "decrease";

/**
 * UseIndentConfig is the config for the useIndent hook.
 * @param editor - The editor to use.
 * @param action - The action to perform.
 * @param hideWhenUnavailable - Whether to hide the button when the command is unavailable.
 */
export interface UseIndentConfig {
  editor?: Editor | null;
  action: IndentAction;
  hideWhenUnavailable?: boolean;
}

export const indentLabels: Record<IndentAction, string> = {
  increase: "Increase indent",
  decrease: "Decrease indent",
};

export const indentIcons = {
  increase: IndentIncreaseIcon,
  decrease: IndentDecreaseIcon,
};

/**
 * canIndent is the function to check if the indent command is available.
 * @param editor - The editor to check.
 * @returns True if the indent command is available, false otherwise.
 */
export function canIndent(editor: Editor | null, action: IndentAction) {
  if (!editor?.isEditable) return false;

  // Exclude problematic targets early (expand later if you want)
  if (isNodeTypeSelected(editor, ["image", "horizontalRule"])) return false;

  if (!isExtensionAvailable(editor, "indent")) return false;

  // if the command doesn’t exist for some reason, editor.can() might throw
  try {
    return action === "increase"
      ? editor.can().indentIncrease()
      : editor.can().indentDecrease();
  } catch {
    return false;
  }
}

/**
 * shouldShowButton is the function to check if the indent button should be shown.
 * @param props - The props for the shouldShowButton function.
 * @returns True if the indent button should be shown, false otherwise.
 */
export function shouldShowButton(props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}) {
  const { editor, hideWhenUnavailable } = props;
  if (!editor) return false;
  if (!hideWhenUnavailable) return true;
  if (!editor.isEditable) return false;
  if (!isExtensionAvailable(editor, "indent")) return false;
  return true;
}

/**
 * useIndent is the hook for the IndentExtension.
 * @param config - The config for the useIndent hook.
 * @returns The isVisible, canRun, handleIndent, label, and Icon for the IndentExtension.
 */
export function useIndent(config: UseIndentConfig) {
  const {
    editor: providedEditor,
    action,
    hideWhenUnavailable = false,
  } = config;
  const { editor } = useTiptapEditor(providedEditor);

  const [isVisible, setIsVisible] = useState(true);
  const canRun = canIndent(editor, action);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }));
    };

    handleSelectionUpdate();
    editor.on("selectionUpdate", handleSelectionUpdate);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);

  const handleIndent = useCallback(() => {
    if (!editor?.isEditable) return false;
    if (!canRun) return false;

    if (action === "increase") {
      return editor.chain().focus().indentIncrease().run();
    }
    return editor.chain().focus().indentDecrease().run();
  }, [editor, action, canRun]);

  return {
    isVisible,
    canRun,
    handleIndent,
    label: indentLabels[action],
    Icon: indentIcons[action],
  };
}
