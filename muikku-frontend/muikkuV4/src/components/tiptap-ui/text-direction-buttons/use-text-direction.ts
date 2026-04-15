import { useCallback, useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";

import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { isExtensionAvailable, isNodeTypeSelected } from "@/lib/tiptap-utils";

import { TextDirectionLeftIcon } from "@/components/tiptap-icons/text-direction-left-icon";
import { TextDirectionRightIcon } from "@/components/tiptap-icons/text-direction-right-icon";

export type TextDirection = "ltr" | "rtl";

/**
 * UseTextDirectionConfig is the configuration for the useTextDirection hook
 */
export interface UseTextDirectionConfig {
  editor?: Editor | null;
  direction: TextDirection;
  hideWhenUnavailable?: boolean;
  onChanged?: () => void;
}

export const textDirectionIcons = {
  ltr: TextDirectionLeftIcon,
  rtl: TextDirectionRightIcon,
};

export const textDirectionLabels: Record<TextDirection, string> = {
  ltr: "Text direction: left-to-right",
  rtl: "Text direction: right-to-left",
};

/**
 * canSetTextDirection checks if the text direction can be set
 * @param editor - The editor instance
 * @param dir - The text direction
 * @returns true if the text direction can be set, false otherwise
 */
export function canSetTextDirection(editor: Editor | null, dir: TextDirection) {
  if (!editor?.isEditable) return false;

  if (
    !isExtensionAvailable(editor, "textDirection") ||
    isNodeTypeSelected(editor, ["image", "horizontalRule"])
  ) {
    return false;
  }

  return editor.can().setTextDirection(dir);
}

/**
 * isTextDirectionActive checks if the text direction is active
 * @param editor - The editor instance
 * @param dir - The text direction
 * @returns true if the text direction is active, false otherwise
 */
export function isTextDirectionActive(
  editor: Editor | null,
  dir: TextDirection
) {
  if (!editor?.isEditable) return false;
  return editor.isActive({ dir });
}

/**
 * toggleTextDirection toggles the text direction
 * @param editor - The editor instance
 * @param dir - The text direction
 * @returns true if the text direction is toggled, false otherwise
 */
export function toggleTextDirection(editor: Editor | null, dir: TextDirection) {
  if (!editor?.isEditable) return false;
  // If already active, remove the override
  if (editor.isActive({ dir })) {
    return editor.chain().focus().unsetTextDirection().run();
  }
  // Otherwise set it
  if (!canSetTextDirection(editor, dir)) return false;
  return editor.chain().focus().setTextDirection(dir).run();
}

/**
 * shouldShowButton checks if the text direction button should be shown
 * @param props - The props for the shouldShowButton function
 * @returns true if the text direction button should be shown, false otherwise
 */
export function shouldShowButton(props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
  direction: TextDirection;
}) {
  const { editor, hideWhenUnavailable, direction } = props;

  if (!editor) return false;
  if (!hideWhenUnavailable) return true;

  if (!editor.isEditable) return false;
  if (!isExtensionAvailable(editor, "textDirection")) return false;

  if (!editor.isActive("code")) {
    return canSetTextDirection(editor, direction);
  }

  return true;
}

/**
 * useTextDirection is the hook for the text direction functionality
 * @param config - The configuration for the useTextDirection hook
 * @returns The text direction functionality
 */
export function useTextDirection(config: UseTextDirectionConfig) {
  const {
    editor: providedEditor,
    direction,
    hideWhenUnavailable = false,
    onChanged,
  } = config;

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = useState(true);

  const canChange = canSetTextDirection(editor, direction);
  const isActive = isTextDirectionActive(editor, direction);

  useEffect(() => {
    if (!editor) return;

    /**
     * handleSelectionUpdate handles the selection update
     * @returns void
     */
    const handleSelectionUpdate = () => {
      setIsVisible(
        shouldShowButton({ editor, direction, hideWhenUnavailable })
      );
    };

    handleSelectionUpdate();
    editor.on("selectionUpdate", handleSelectionUpdate);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable, direction]);

  /**
   * handleChange handles the change of the text direction
   * @returns true if the text direction is changed, false otherwise
   */
  const handleChange = useCallback(() => {
    if (!editor) return false;

    const ok = toggleTextDirection(editor, direction);
    if (ok) onChanged?.();
    return ok;
  }, [editor, direction, onChanged]);

  return {
    isVisible,
    isActive,
    canChange,
    handleChange,
    label: textDirectionLabels[direction],
    Icon: textDirectionIcons[direction],
  };
}
