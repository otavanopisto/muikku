"use client";

import { useCallback, useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";

import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";

import { isExtensionAvailable, isNodeTypeSelected } from "@/lib/tiptap-utils";

import { TextColorIcon } from "@/components/tiptap-icons/text-color-icon";

export const TEXT_COLOR_SHORTCUT_KEY = "mod+shift+c";

export const TEXT_COLORS = [
  { label: "Black", value: "#111827" },
  { label: "Gray", value: "#6B7280" },
  { label: "Red", value: "#EF4444" },
  { label: "Orange", value: "#F97316" },
  { label: "Yellow", value: "#EAB308" },
  { label: "Green", value: "#22C55E" },
  { label: "Blue", value: "#3B82F6" },
  { label: "Purple", value: "#A855F7" },
] as const;

export type TextColor = (typeof TEXT_COLORS)[number];

/**
 * UseTextColorConfig is the configuration for the useTextColor hook
 */
export interface UseTextColorConfig {
  editor?: Editor | null;
  color?: string;
  label?: string;
  hideWhenUnavailable?: boolean;
  onApplied?: ({ color, label }: { color: string; label: string }) => void;
}

/**
 * canSetTextColor checks if the text color can be set
 * @param editor - The editor instance
 * @returns true if the text color can be set, false otherwise
 */
export function canSetTextColor(editor: Editor | null) {
  if (!editor?.isEditable) return false;
  if (
    !isExtensionAvailable(editor, "color") ||
    isNodeTypeSelected(editor, ["image", "horizontalRule"])
  ) {
    return false;
  }
  return editor.can().setColor("test");
}

/**
 * isTextColorActive checks if the text color is active
 * @param editor - The editor instance
 * @param color - The color to check
 * @returns true if the text color is active, false otherwise
 */
export function isTextColorActive(editor: Editor | null, color?: string) {
  if (!editor || !editor.isEditable || !color) return false;
  return editor.isActive("textStyle", { color });
}

/**
 * hasTextColor checks if the text color is present
 * @param editor - The editor instance
 * @returns true if the text color is present, false otherwise
 */
export function hasTextColor(editor: Editor | null) {
  if (!editor?.isEditable) return false;
  const attrs = editor.getAttributes("textStyle") as { color?: string | null };
  return !!attrs?.color;
}

/**
 * setTextColor sets the text color
 * @param editor - The editor instance
 * @param color - The color to set
 * @returns true if the text color is set, false otherwise
 */
export function setTextColor(editor: Editor | null, color: string) {
  if (!editor?.isEditable) return false;
  if (!canSetTextColor(editor)) return false;
  return editor.chain().focus().setColor(color).run();
}

/**
 * unsetTextColor unsets the text color
 * @param editor - The editor instance
 * @returns true if the text color is unset, false otherwise
 */
export function unsetTextColor(editor: Editor | null) {
  if (!editor?.isEditable) return false;
  if (!isExtensionAvailable(editor, "color")) return false;
  return editor.chain().focus().unsetColor().run();
}

/**
 * shouldShowButton checks if the text color button should be shown
 * @param props - The props for the shouldShowButton function
 * @returns true if the text color button should be shown, false otherwise
 */
export function shouldShowButton(props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}) {
  const { editor, hideWhenUnavailable } = props;
  if (!editor) return false;
  if (!hideWhenUnavailable) return true;
  if (!editor.isEditable) return false;
  if (!isExtensionAvailable(editor, "color")) return false;
  if (!editor.isActive("code")) return canSetTextColor(editor);
  return true;
}

/**
 * useTextColor is the hook for the text color functionality
 * @param config - The configuration for the useTextColor hook
 * @returns The text color functionality
 */
export function useTextColor(config: UseTextColorConfig) {
  const {
    editor: providedEditor,
    color,
    label,
    hideWhenUnavailable = false,
    onApplied,
  } = config;

  const { editor } = useTiptapEditor(providedEditor);
  const isMobile = useIsBreakpoint();
  const [isVisible, setIsVisible] = useState(true);

  const canTextColor = canSetTextColor(editor);
  const isActive = isTextColorActive(editor, color);

  useEffect(() => {
    if (!editor) return;

    /**
     * handleSelectionUpdate handles the selection update
     */
    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }));
    };

    handleSelectionUpdate();
    editor.on("selectionUpdate", handleSelectionUpdate);
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable]);

  const handleSetColor = useCallback(() => {
    if (!editor || !canTextColor || !color || !label) return false;
    const ok = setTextColor(editor, color);
    if (ok) onApplied?.({ color, label });
    return ok;
  }, [editor, canTextColor, color, label, onApplied]);

  const handleUnsetColor = useCallback(() => {
    const ok = unsetTextColor(editor);
    if (ok) onApplied?.({ color: "", label: "Default text color" });
    return ok;
  }, [editor, onApplied]);

  return {
    isVisible,
    isActive,
    canTextColor,
    handleSetColor,
    handleUnsetColor,
    label: label ?? "Text color",
    shortcutKeys: TEXT_COLOR_SHORTCUT_KEY,
    Icon: TextColorIcon,
    isMobile,
  };
}
