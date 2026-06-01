/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { MuikkuSelectFieldModal } from "./MuikkuSelectFieldModal";
import { useTiptapEditorV2 } from "@/hooks/use-tiptap-editor-v2";
import { useCallbackOnEvent } from "@/hooks/use-callback-on-event";
import { OPEN_EVENT } from "./MuikkuSelectFieldExtension";

/**
 * The Muikku select field button props interface.
 */
export interface MuikkuSelectFieldButtonProps
  extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

/**
 * The Muikku select field button component.
 * @param props - The props for the Muikku select field button component.
 * @returns The Muikku select field button component.
 */
export const MuikkuSelectFieldButton = forwardRef<
  HTMLButtonElement,
  MuikkuSelectFieldButtonProps
>(({ editor: providedEditor, ...buttonProps }, ref) => {
  const { editor, selected } = useTiptapEditorV2({
    editor: providedEditor,
    selector: ({ editor }) => ({
      isActive: editor.isActive("muikkuSelectionField"),
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
        tooltip="Valintakenttä"
        onClick={handleOpenClick}
        tabIndex={-1}
        role="button"
        ref={ref}
        {...buttonProps}
      >
        Valintakenttä
      </Button>

      <MuikkuSelectFieldModal
        editor={editor}
        opened={open}
        onClose={handleCloseClick}
      />
    </>
  );
});
