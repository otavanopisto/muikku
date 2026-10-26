/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { DivFrameModal } from "./DivFrameModal";
import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { useTiptapEditorV2 } from "~/src/hooks/use-tiptap-editor-v2";

/**
 * The DivFrameToolbarButtonProps interface.
 */
export interface DivFrameToolbarButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

/**
 * The DivFrameToolbarButton component.
 * @param editor - The editor.
 * @returns The DivFrameToolbarButton component.
 */
export const DivFrameToolbarButton = forwardRef<
  HTMLButtonElement,
  DivFrameToolbarButtonProps
>(({ editor: providedEditor, ...buttonProps }, ref) => {
  const [open, setOpen] = useState(false);
  const { editor, selected } = useTiptapEditorV2({
    editor: providedEditor,
    selector: ({ editor: instance }) => ({
      isActive: instance.isActive("divFrame"),
      isDisabled: !instance.isEditable,
    }),
  });

  const isActive = selected?.isActive ?? false;
  const isDisabled = selected?.isDisabled ?? false;

  return (
    <>
      <Button
        size="small"
        variant="ghost"
        onClick={() => setOpen(true)}
        ref={ref}
        aria-pressed={isActive}
        data-active-state={isActive ? "on" : "off"}
        data-disabled={isDisabled}
        disabled={isDisabled}
        {...buttonProps}
      >
        Div
      </Button>
      <DivFrameModal
        editor={editor}
        opened={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
});
