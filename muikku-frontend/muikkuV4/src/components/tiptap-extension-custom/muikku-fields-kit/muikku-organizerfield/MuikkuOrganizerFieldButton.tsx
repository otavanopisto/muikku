/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { MuikkuOrganizerFieldModal } from "./MuikkuOrganizerFieldModal";
import { useTiptapEditorV2 } from "@/hooks/use-tiptap-editor-v2";
import { useCallbackOnEvent } from "@/hooks/use-callback-on-event";
import { OPEN_EVENT } from "./MuikkuOrganizerFieldExtension";
/**
 * The Muikku organizer field button props interface.
 */
export interface MuikkuOrganizerFieldButtonProps
  extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

/**
 * The Muikku organizer field button component.
 * @param props - The props for the Muikku organizer field button component.
 * @returns The Muikku organizer field button component.
 */
export const MuikkuOrganizerFieldButton = forwardRef<
  HTMLButtonElement,
  MuikkuOrganizerFieldButtonProps
>(({ editor: providedEditor, ...buttonProps }, ref) => {
  const { editor, selected } = useTiptapEditorV2({
    editor: providedEditor,
    selector: ({ editor }) => ({
      isActive: editor.isActive("muikkuOrganizerField"),
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

  if (!editor?.isEditable) return null;

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        data-active-state={isActive ? "on" : "off"}
        tooltip="Ryhmittelykenttä"
        onClick={handleOpenClick}
        tabIndex={-1}
        role="button"
        ref={ref}
        {...buttonProps}
      >
        Ryhmittelykenttä
      </Button>

      <MuikkuOrganizerFieldModal
        editor={editor}
        opened={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
});
