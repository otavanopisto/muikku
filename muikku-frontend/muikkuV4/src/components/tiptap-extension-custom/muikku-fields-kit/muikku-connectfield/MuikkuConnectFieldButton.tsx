/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { MuikkuConnectFieldModal } from "./MuikkuConnectFieldModal";
import { useTiptapEditorV2 } from "@/hooks/use-tiptap-editor-v2";
import { useCallbackOnEvent } from "@/hooks/use-callback-on-event";
import { OPEN_EVENT } from "./MuikkuConnectFieldExtension";

/**
 * The Muikku connect field button props interface.
 */
export interface MuikkuConnectFieldButtonProps
  extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

export const MuikkuConnectFieldButton = forwardRef<
  HTMLButtonElement,
  MuikkuConnectFieldButtonProps
>(({ editor: providedEditor, ...buttonProps }, ref) => {
  const { editor, selected } = useTiptapEditorV2({
    editor: providedEditor,
    selector: ({ editor }) => ({
      isActive: editor.isActive("muikkuConnectField"),
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
   * The handleSetConnectFieldClick function.
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
        tooltip="Yhdistelykenttä"
        onClick={handleOpenClick}
        tabIndex={-1}
        role="button"
        ref={ref}
        {...buttonProps}
      >
        Yhdistelykenttä
      </Button>

      <MuikkuConnectFieldModal
        editor={editor}
        opened={open}
        onClose={handleCloseClick}
      />
    </>
  );
});
