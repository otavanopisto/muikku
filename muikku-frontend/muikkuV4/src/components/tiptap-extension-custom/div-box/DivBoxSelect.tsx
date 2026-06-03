/* eslint-disable react-x/no-forward-ref */
import * as React from "react";
import type { Editor } from "@tiptap/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/tiptap-ui-primitive/dropdown-menu";
import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";

import { blockStylesSet } from "./helper";
import { canUseDivBox, getCurrentDivBoxPreset } from "./helper";
import { DivBoxPresetButton } from "./DivBoxPresetButton";
import { useTiptapEditorV2 } from "~/src/hooks/use-tiptap-editor-v2";

/**
 * The DivBoxSelectProps interface.
 */
export interface DivBoxSelectProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

/**
 * The DivBoxSelect component.
 * @param props - The props for the DivBoxSelect component.
 * @returns The DivBoxSelect component.
 */
export const DivBoxSelect = React.forwardRef<HTMLDivElement, DivBoxSelectProps>(
  ({ editor: providedEditor, ...buttonProps }, _ref) => {
    const { editor, selected } = useTiptapEditorV2({
      editor: providedEditor,
      selector: ({ editor }) => ({
        canUseDivBox: canUseDivBox(editor),
        currentPreset: getCurrentDivBoxPreset(editor),
      }),
    });
    const [open, setOpen] = React.useState(false);

    /**
     * The handleCloseClick function.
     */
    const handleCloseClick = () => {
      setOpen(false);
    };

    if (!editor?.isEditable) return null;

    const currentPreset = selected?.currentPreset ?? undefined;
    const isDisabled = !(selected?.canUseDivBox ?? false);

    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            data-style="ghost"
            data-active-state={currentPreset ? "on" : "off"}
            role="button"
            tabIndex={-1}
            aria-label="Select box style"
            aria-expanded={open}
            aria-haspopup="true"
            tooltip="Box style"
            disabled={isDisabled}
            {...buttonProps}
          >
            {currentPreset ?? "Ei asetettu"}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {blockStylesSet.map((style) => (
            <DivBoxPresetButton
              key={style.name}
              editor={editor}
              styleName={style.name}
              onClick={handleCloseClick}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
