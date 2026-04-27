"use client";

import { useEffect, useMemo, useState } from "react";
import type { Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditorV2 } from "@/hooks/use-tiptap-editor-v2";

// --- Icons ---
import { ListIcon } from "@/components/tiptap-icons/list-icon";
import { ListOrderedIcon } from "@/components/tiptap-icons/list-ordered-icon";
import { ListTodoIcon } from "@/components/tiptap-icons/list-todo-icon";

// --- Lib ---
import { isNodeInSchema } from "@/lib/tiptap-utils";

// --- Tiptap UI ---
import {
  canToggleList,
  isListActive,
  listIcons,
  type ListType,
} from "@/components/tiptap-ui/list-button";

/**
 * Configuration for the list dropdown menu functionality
 */
export interface UseListDropdownMenuConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null;
  /**
   * The list types to display in the dropdown.
   * @default ["bulletList", "orderedList", "taskList"]
   */
  types?: ListType[];
  /**
   * Whether the dropdown should be hidden when no list types are available
   * @default false
   */
  hideWhenUnavailable?: boolean;
}

/**
 * The ListOption interface.
 */
export interface ListOption {
  label: string;
  type: ListType;
  icon: React.ElementType;
}

export const listOptions: ListOption[] = [
  {
    label: "Bullet List",
    type: "bulletList",
    icon: ListIcon,
  },
  {
    label: "Ordered List",
    type: "orderedList",
    icon: ListOrderedIcon,
  },
  {
    label: "Task List",
    type: "taskList",
    icon: ListTodoIcon,
  },
];

/**
 * Checks if any list type can be toggled.
 * @param editor - The Tiptap editor instance.
 * @param listTypes - The list types to check.
 * @returns True if any list type can be toggled, false otherwise.
 */
export function canToggleAnyList(
  editor: Editor | null,
  listTypes: ListType[]
): boolean {
  if (!editor?.isEditable) return false;
  return listTypes.some((type) => canToggleList(editor, type));
}

/**
 * Checks if any list type is active.
 * @param editor - The Tiptap editor instance.
 * @param listTypes - The list types to check.
 * @returns True if any list type is active, false otherwise.
 */
export function isAnyListActive(
  editor: Editor | null,
  listTypes: ListType[]
): boolean {
  if (!editor?.isEditable) return false;
  return listTypes.some((type) => isListActive(editor, type));
}

/**
 * Gets the filtered list options.
 * @param availableTypes - The list types to filter.
 * @returns The filtered list options.
 */
export function getFilteredListOptions(
  availableTypes: ListType[]
): typeof listOptions {
  return listOptions.filter(
    (option) => !option.type || availableTypes.includes(option.type)
  );
}

/**
 * Checks if the list dropdown should be shown.
 * @param params - The parameters for the shouldShowListDropdown function.
 * @returns True if the list dropdown should be shown, false otherwise.
 */
export function shouldShowListDropdown(params: {
  editor: Editor | null;
  listTypes: ListType[];
  hideWhenUnavailable: boolean;
  listInSchema: boolean;
  canToggleAny: boolean;
}): boolean {
  const { editor, hideWhenUnavailable, listInSchema, canToggleAny } = params;

  if (!editor) return false;

  if (!hideWhenUnavailable) {
    return true;
  }

  if (!listInSchema) return false;

  if (!editor.isActive("code")) {
    return canToggleAny;
  }

  return true;
}

/**
 * Gets the currently active list type from the available types
 * @param editor - The Tiptap editor instance.
 * @param availableTypes - The list types to check.
 * @returns The currently active list type or undefined.
 */
export function getActiveListType(
  editor: Editor | null,
  availableTypes: ListType[]
): ListType | undefined {
  if (!editor?.isEditable) return undefined;
  return availableTypes.find((type) => isListActive(editor, type));
}

/**
 * Custom hook that provides list dropdown menu functionality for Tiptap editor
 *
 * @example
 * ```tsx
 * // Simple usage
 * function MyListDropdown() {
 *   const {
 *     isVisible,
 *     activeType,
 *     isAnyActive,
 *     canToggleAny,
 *     filteredLists,
 *   } = useListDropdownMenu()
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
 * function MyAdvancedListDropdown() {
 *   const {
 *     isVisible,
 *     activeType,
 *   } = useListDropdownMenu({
 *     editor: myEditor,
 *     types: ["bulletList", "orderedList"],
 *     hideWhenUnavailable: true,
 *   })
 *
 *   // component implementation
 * }
 * ```
 */
export function useListDropdownMenu(config?: UseListDropdownMenuConfig) {
  const {
    editor: providedEditor,
    types = ["bulletList", "orderedList", "taskList"],
    hideWhenUnavailable = false,
  } = config ?? {};

  const { editor, selected } = useTiptapEditorV2({
    editor: providedEditor,
    selector: ({ editor }) => ({
      activeType: getActiveListType(editor, types),
      isAnyActive: isAnyListActive(editor, types),
      canToggleAny: canToggleAnyList(editor, types),
    }),
  });
  const [isVisible, setIsVisible] = useState(true);

  const listInSchema = types.some((type) => isNodeInSchema(type, editor));

  const filteredLists = useMemo(() => getFilteredListOptions(types), [types]);
  const activeList = useMemo(
    () => filteredLists.find((o) => o.type === selected?.activeType),
    [filteredLists, selected?.activeType]
  );

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      setIsVisible(
        shouldShowListDropdown({
          editor,
          listTypes: types,
          hideWhenUnavailable,
          listInSchema,
          canToggleAny: selected?.canToggleAny ?? false,
        })
      );
    };

    handleSelectionUpdate();

    editor.on("selectionUpdate", handleSelectionUpdate);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [
    editor,
    hideWhenUnavailable,
    listInSchema,
    selected?.canToggleAny,
    types,
  ]);

  return {
    isVisible,
    activeType: selected?.activeType,
    isActive: selected?.isAnyActive ?? false,
    canToggle: selected?.canToggleAny ?? false,
    types,
    filteredLists,
    label: "List",
    Icon: activeList ? listIcons[activeList.type] : ListIcon,
  };
}
