"use client";

import { useCallback, useEffect, useState } from "react";
import { type Editor } from "@tiptap/react";
import { useHotkeys } from "react-hotkeys-hook";

// --- Hooks ---
import { useTiptapEditorV2 } from "@/hooks/use-tiptap-editor-v2";
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";

// --- Lib ---
import {
  isMarkInSchema,
  isNodeTypeSelected,
  isExtensionAvailable,
} from "@/lib/tiptap-utils";

// --- Icons ---
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon";

export const COLOR_HIGHLIGHT_SHORTCUT_KEY = "mod+shift+h";
export const HIGHLIGHT_COLORS = [
  {
    label: "Default background",
    value: "var(--tt-bg-color)",
    colorValue: "#ffffff",
    border: "var(--tt-bg-color-contrast)",
  },
  {
    label: "Gray background",
    value: "var(--tt-color-highlight-gray)",
    colorValue: "#f8f8f7",
    border: "var(--tt-color-highlight-gray-contrast)",
  },
  {
    label: "Brown background",
    value: "var(--tt-color-highlight-brown)",
    colorValue: "#f4eeee",
    border: "var(--tt-color-highlight-brown-contrast)",
  },
  {
    label: "Orange background",
    value: "var(--tt-color-highlight-orange)",
    colorValue: "#fbecdd",
    border: "var(--tt-color-highlight-orange-contrast)",
  },
  {
    label: "Yellow background",
    value: "var(--tt-color-highlight-yellow)",
    colorValue: "#fef9c3",
    border: "var(--tt-color-highlight-yellow-contrast)",
  },
  {
    label: "Green background",
    value: "var(--tt-color-highlight-green)",
    colorValue: "#dcfce7",
    border: "var(--tt-color-highlight-green-contrast)",
  },
  {
    label: "Blue background",
    value: "var(--tt-color-highlight-blue)",
    colorValue: "#e0f2fe",
    border: "var(--tt-color-highlight-blue-contrast)",
  },
  {
    label: "Purple background",
    value: "var(--tt-color-highlight-purple)",
    colorValue: "#f3e8ff",
    border: "var(--tt-color-highlight-purple-contrast)",
  },
  {
    label: "Pink background",
    value: "var(--tt-color-highlight-pink)",
    colorValue: "#fcf1f6",
    border: "var(--tt-color-highlight-pink-contrast)",
  },
  {
    label: "Red background",
    value: "var(--tt-color-highlight-red)",
    colorValue: "#ffe4e6",
    border: "var(--tt-color-highlight-red-contrast)",
  },
];
export type HighlightColor = (typeof HIGHLIGHT_COLORS)[number];

export type HighlightMode = "mark" | "node";

/**
 * Configuration for the color highlight functionality
 */
export interface UseColorHighlightConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null;
  /**
   * The color to apply when toggling the highlight.
   */
  highlightColor?: string;
  /**
   * Optional label to display alongside the icon.
   */
  label?: string;
  /**
   * Whether the button should hide when the mark is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean;
  /**
   * The highlighting mode to use.
   * - "mark": Uses the highlight mark extension (default)
   * - "node": Uses the node background extension
   * @default "mark"
   */
  mode?: HighlightMode;
  /**
   * When true, uses the actual color value (colorValue) instead of CSS variable (value).
   * @default false
   */
  useColorValue?: boolean;
  /**
   * Called when the highlight is applied.
   */
  onApplied?: ({
    color,
    label,
    mode,
  }: {
    color: string;
    label: string;
    mode: HighlightMode;
  }) => void;
}

/**
 * Picks highlight colors by value
 * @param values - The values to pick colors from
 * @returns The picked colors
 */
export function pickHighlightColorsByValue(values: string[]) {
  const colorMap = new Map(
    HIGHLIGHT_COLORS.map((color) => [color.value, color])
  );
  return values
    .map((value) => colorMap.get(value))
    .filter((color): color is (typeof HIGHLIGHT_COLORS)[number] => !!color);
}

/**
 * Gets the appropriate color value based on configuration
 * @param color - The color to get the value for
 * @param useColorValue - Whether to use the color value
 * @returns The appropriate color value
 */
export function getHighlightColorValue(
  color: string,
  useColorValue = false
): string {
  if (!useColorValue) return color;

  const colorItem = HIGHLIGHT_COLORS.find(
    (c) => c.value === color || c.colorValue === color
  );
  return colorItem?.colorValue ?? color;
}

/**
 * Checks if highlight can be applied based on the mode and current editor state
 * @param editor - The Tiptap editor instance
 * @param mode - The highlighting mode to use
 * @returns True if highlight can be applied, false otherwise
 */
export function canColorHighlight(
  editor: Editor | null,
  mode: HighlightMode = "mark"
): boolean {
  if (!editor?.isEditable) return false;

  if (mode === "mark") {
    if (
      !isMarkInSchema("highlight", editor) ||
      isNodeTypeSelected(editor, ["image"])
    )
      return false;

    return editor.can().setMark("highlight");
  } else {
    if (!isExtensionAvailable(editor, ["nodeBackground"])) return false;

    try {
      return editor.can().toggleNodeBackgroundColor("test");
    } catch {
      return false;
    }
  }
}

/**
 * Checks if highlight is currently active
 * @param editor - The Tiptap editor instance
 * @param highlightColor - The color to check
 * @param mode - The highlighting mode to use
 * @returns True if highlight is active, false otherwise
 */
export function isColorHighlightActive(
  editor: Editor | null,
  highlightColor?: string,
  mode: HighlightMode = "mark"
): boolean {
  if (!editor?.isEditable) return false;

  if (mode === "mark") {
    return highlightColor
      ? editor.isActive("highlight", { color: highlightColor })
      : editor.isActive("highlight");
  } else {
    if (!highlightColor) return false;

    try {
      const { state } = editor;
      const { selection } = state;

      const $pos = selection.$anchor;
      for (let depth = $pos.depth; depth >= 0; depth--) {
        const node = $pos.node(depth);
        if (node && node.attrs?.backgroundColor === highlightColor) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }
}

/**
 * Removes highlight based on the mode
 * @param editor - The Tiptap editor instance
 * @param mode - The highlighting mode to use
 * @returns True if highlight is removed, false otherwise
 */
export function removeHighlight(
  editor: Editor | null,
  mode: HighlightMode = "mark"
): boolean {
  if (!editor?.isEditable) return false;
  if (!canColorHighlight(editor, mode)) return false;

  if (mode === "mark") {
    return editor.chain().focus().unsetMark("highlight").run();
  } else {
    return editor.chain().focus().unsetNodeBackgroundColor().run();
  }
}

/**
 * Determines if the highlight button should be shown
 * @param props - The props for the shouldShowButton function
 * @returns True if the highlight button should be shown, false otherwise
 */
export function shouldShowButton(props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
  mode: HighlightMode;
}): boolean {
  const { editor, hideWhenUnavailable, mode } = props;

  if (!editor) return false;

  if (!hideWhenUnavailable) {
    return true;
  }

  if (!editor.isEditable) return false;

  // hideWhenUnavailable=true: check schema/extension availability
  if (mode === "mark") {
    if (!isMarkInSchema("highlight", editor)) return false;
  } else {
    if (!isExtensionAvailable(editor, ["nodeBackground"])) return false;
  }

  if (!editor.isActive("code")) {
    return canColorHighlight(editor, mode);
  }

  return true;
}

/**
 * The useColorHighlight hook
 * @param config - The configuration for the useColorHighlight hook
 * @returns The color highlight functionality
 */
export function useColorHighlight(config: UseColorHighlightConfig) {
  const {
    editor: providedEditor,
    label,
    highlightColor,
    hideWhenUnavailable = false,
    mode = "mark",
    useColorValue = false,
    onApplied,
  } = config;

  const { editor, selected } = useTiptapEditorV2({
    editor: providedEditor,
    selector: ({ editor }) => {
      const actualColor = highlightColor
        ? getHighlightColorValue(highlightColor, useColorValue)
        : highlightColor;

      return {
        canColorHighlight: canColorHighlight(editor, mode),
        isActive: isColorHighlightActive(editor, actualColor, mode),
        actualColor,
      };
    },
  });
  const isMobile = useIsBreakpoint();
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const canColorHighlightState = selected?.canColorHighlight ?? false;
  const isActiveState = selected?.isActive ?? false;
  const actualColorState = selected?.actualColor;

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable, mode }));
    };

    handleSelectionUpdate();

    editor.on("selectionUpdate", handleSelectionUpdate);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, hideWhenUnavailable, mode]);

  const handleColorHighlight = useCallback(() => {
    if (!editor || !canColorHighlightState || !actualColorState || !label)
      return false;

    if (mode === "mark") {
      if (editor.state.storedMarks) {
        const highlightMarkType = editor.schema.marks.highlight;
        if (highlightMarkType) {
          editor.view.dispatch(
            editor.state.tr.removeStoredMark(highlightMarkType)
          );
        }
      }

      setTimeout(() => {
        const success = editor
          .chain()
          .focus()
          .toggleHighlight({ color: actualColorState })
          .run();
        if (success) {
          onApplied?.({ color: actualColorState, label, mode });
        }
        return success;
      }, 0);

      return true;
    } else {
      const success = editor
        .chain()
        .focus()
        .toggleNodeBackgroundColor(actualColorState)
        .run();

      if (success) {
        onApplied?.({ color: actualColorState, label, mode });
      }
      return success;
    }
  }, [
    editor,
    canColorHighlightState,
    actualColorState,
    label,
    mode,
    onApplied,
  ]);

  const handleRemoveHighlight = useCallback(() => {
    const success = removeHighlight(editor, mode);
    if (success) {
      onApplied?.({ color: "", label: "Remove highlight", mode });
    }
    return success;
  }, [editor, onApplied, mode]);

  useHotkeys(
    COLOR_HIGHLIGHT_SHORTCUT_KEY,
    (event) => {
      event.preventDefault();
      handleColorHighlight();
    },
    {
      enabled: isVisible && (selected?.canColorHighlight ?? false),
      enableOnContentEditable: !isMobile,
      enableOnFormTags: true,
    }
  );

  return {
    isVisible,
    isActive: isActiveState,
    handleColorHighlight,
    handleRemoveHighlight,
    canColorHighlight: canColorHighlightState,
    label: label ?? `Highlight`,
    shortcutKeys: COLOR_HIGHLIGHT_SHORTCUT_KEY,
    Icon: HighlighterIcon,
    mode,
  };
}
