"use client";

import type { Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditorV2 } from "@/hooks/use-tiptap-editor-v2";

// --- Icons ---
import { HeadingIcon } from "@/components/tiptap-icons/heading-icon";

// --- Tiptap UI ---
import {
  headingIcons,
  type Level,
  isHeadingActive,
  canToggle,
  shouldShowButton,
} from "@/components/tiptap-ui/heading-button";

/**
 * Configuration for the heading dropdown menu functionality
 */
export interface UseHeadingDropdownMenuConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null;
  /**
   * Available heading levels to show in the dropdown
   * @default [1, 2, 3, 4, 5, 6]
   */
  levels?: Level[];
  /**
   * Whether the dropdown should hide when headings are not available.
   * @default false
   */
  hideWhenUnavailable?: boolean;
}

/**
 * Gets the currently active heading level from the available levels
 */
export function getActiveHeadingLevel(
  editor: Editor | null,
  levels: Level[] = [1, 2, 3, 4, 5, 6]
): Level | undefined {
  if (!editor?.isEditable) return undefined;
  return levels.find((level) => isHeadingActive(editor, level));
}

/**
 * Custom hook that provides heading dropdown menu functionality for Tiptap editor
 *
 * @example
 * ```tsx
 * // Simple usage
 * function MyHeadingDropdown() {
 *   const {
 *     isVisible,
 *     activeLevel,
 *     isAnyHeadingActive,
 *     canToggle,
 *     levels,
 *   } = useHeadingDropdownMenu()
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <DropdownMenu>
 *       // dropdown content
 *     </DropdownMenu>
 *   )
 * }
 *
 * // Advanced usage with configuration
 * function MyAdvancedHeadingDropdown() {
 *   const {
 *     isVisible,
 *     activeLevel,
 *   } = useHeadingDropdownMenu({
 *     editor: myEditor,
 *     levels: [1, 2, 3],
 *     hideWhenUnavailable: true,
 *   })
 *
 *   // component implementation
 * }
 * ```
 */
export function useHeadingDropdownMenu(config?: UseHeadingDropdownMenuConfig) {
  const {
    editor: providedEditor,
    levels = [1, 2, 3, 4, 5, 6],
    hideWhenUnavailable = false,
  } = config ?? {};

  const { selected } = useTiptapEditorV2({
    editor: providedEditor,
    selector: ({ editor: instance }) => ({
      activeLevel: getActiveHeadingLevel(instance, levels),
      isActive: isHeadingActive(instance),
      canToggle: canToggle(instance),
      isVisible: shouldShowButton({
        editor: instance,
        hideWhenUnavailable,
        level: levels,
      }),
    }),
  });

  return {
    isVisible: selected?.isVisible ?? false,
    activeLevel: selected?.activeLevel,
    isActive: selected?.isActive,
    canToggle: selected?.canToggle,
    levels,
    label: "Heading",
    Icon: selected?.activeLevel
      ? headingIcons[selected.activeLevel]
      : HeadingIcon,
  };
}
