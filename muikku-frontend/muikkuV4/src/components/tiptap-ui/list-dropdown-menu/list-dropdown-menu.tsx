import { useCallback, useState } from "react";
import { type Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditorV2 } from "@/hooks/use-tiptap-editor-v2";

// --- Icons ---
import { ChevronDownIcon } from "@/components/tiptap-icons/chevron-down-icon";

// --- Tiptap UI ---
import { ListButton, type ListType } from "@/components/tiptap-ui/list-button";

import { useListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu/use-list-dropdown-menu";

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button } from "@/components/tiptap-ui-primitive/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/tiptap-ui-primitive/dropdown-menu";

/**
 * The ListDropdownMenu props interface.
 */
export interface ListDropdownMenuProps extends Omit<ButtonProps, "type"> {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor;
  /**
   * The list types to display in the dropdown.
   */
  types?: ListType[];
  /**
   * Whether the dropdown should be hidden when no list types are available
   * @default false
   */
  hideWhenUnavailable?: boolean;
  /**
   * Callback for when the dropdown opens or closes
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Whether the dropdown should use a modal
   */
  modal?: boolean;
}

/**
 * The ListDropdownMenu component.
 * @param props - The props for the ListDropdownMenu component.
 * @returns The ListDropdownMenu component.
 */
export function ListDropdownMenu({
  editor: providedEditor,
  // eslint-disable-next-line react-x/no-unstable-default-props
  types = ["bulletList", "orderedList", "taskList"],
  hideWhenUnavailable = false,
  onOpenChange,
  modal = true,
  ...props
}: ListDropdownMenuProps) {
  const { editor } = useTiptapEditorV2({ editor: providedEditor });
  const [isOpen, setIsOpen] = useState(false);

  const { filteredLists, canToggle, isActive, isVisible, Icon } =
    useListDropdownMenu({
      editor,
      types,
      hideWhenUnavailable,
    });

  const handleOnOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      onOpenChange?.(open);
    },
    [onOpenChange]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <DropdownMenu modal={modal} open={isOpen} onOpenChange={handleOnOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          data-active-state={isActive ? "on" : "off"}
          role="button"
          tabIndex={-1}
          disabled={!canToggle}
          data-disabled={!canToggle}
          aria-label="List options"
          tooltip="List"
          {...props}
        >
          <Icon className="tiptap-button-icon" />
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          {filteredLists.map((option) => (
            <DropdownMenuItem key={option.type} asChild>
              <ListButton
                editor={editor}
                type={option.type}
                text={option.label}
                showTooltip={false}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ListDropdownMenu;
