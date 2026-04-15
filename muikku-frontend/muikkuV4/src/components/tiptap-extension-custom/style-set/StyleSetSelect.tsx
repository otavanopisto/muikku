import * as React from "react";
import { type Editor } from "@tiptap/react";

import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

import { StyleButton } from "./StyleButton";
import { blockStylesSet, canApplyStyle, getCurrentStyle } from "./helper";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/tiptap-ui-primitive/dropdown-menu";
import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";

/**
 * The StyleSetSelectProps interface
 */
export interface StyleSetSelectProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

/**
 * The StyleSetSelect component
 * @param props - The props for the StyleSetSelect component
 * @param _ref - The ref for the StyleSetSelect component
 * @returns The StyleSetSelect component
 */
// eslint-disable-next-line react-x/no-forward-ref
export const StyleSetSelect = React.forwardRef<
  HTMLDivElement,
  StyleSetSelectProps
>(({ editor: providedEditor, ...buttonProps }, _ref) => {
  const { editor } = useTiptapEditor(providedEditor);
  const [open, setOpen] = React.useState(false);

  if (!editor?.isEditable) {
    return null;
  }

  const currentStyle = getCurrentStyle(editor);
  const isDisabled = !canApplyStyle(editor);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          data-style="ghost"
          data-active-state={currentStyle ? "on" : "off"}
          role="button"
          tabIndex={-1}
          aria-label="Select style"
          aria-expanded={open}
          aria-haspopup="true"
          tooltip="Select style"
          disabled={isDisabled}
          {...buttonProps}
        >
          {currentStyle ?? "Style"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {blockStylesSet.map((style) => (
          <StyleButton
            key={style.name}
            editor={editor}
            styleName={style.name}
            onClick={() => setOpen(false)}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

StyleSetSelect.displayName = "StyleSetSelect";
export default StyleSetSelect;
