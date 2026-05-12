/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { MuikkuMemoFieldModal } from "./MuikkuMemoFieldModal";
import { useTiptapEditorV2 } from "@/hooks/use-tiptap-editor-v2";
import { useCallbackOnEvent } from "@/hooks/use-callback-on-event";
import { OPEN_EVENT } from "./MuikkuMemoFieldExtension";

/**
 * The Muikku memo field button props interface.
 */
export interface MuikkuMemoFieldButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

/**
 * The Muikku memo field button component.
 * @param props - The props for the Muikku memo field button component.
 * @returns The Muikku memo field button component.
 */
export const MuikkuMemoFieldButton = forwardRef<
  HTMLButtonElement,
  MuikkuMemoFieldButtonProps
>(({ editor: providedEditor, ...buttonProps }, ref) => {
  const { editor, selected } = useTiptapEditorV2({
    editor: providedEditor,
    selector: ({ editor }) => ({
      isActive: editor.isActive("muikkuMemoField"),
    }),
  });
  const isActive = selected?.isActive ?? false;
  const [open, setOpen] = useState(false);

  useCallbackOnEvent(OPEN_EVENT, () => setOpen(true));

  /**
   * The handleOpenClick function.
   */
  const handleOpenClick = () => {
    setOpen(true);
  };

  /**
   * The handleCloseClick function.
   */
  const handleCloseClick = () => {
    setOpen(false);
  };

  if (!editor?.isEditable) return null;

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        data-active-state={isActive ? "on" : "off"}
        tooltip="Muistiokenttä"
        onClick={handleOpenClick}
        tabIndex={-1}
        role="button"
        ref={ref}
        {...buttonProps}
      >
        Muistiokenttä
      </Button>

      <MuikkuMemoFieldModal
        editor={editor}
        opened={open}
        onClose={handleCloseClick}
      />
    </>
  );
});
