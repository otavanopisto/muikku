/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { MuikkuOrganizerFieldModal } from "./MuikkuOrganizerFieldModal";
import { useTiptapEditorV2 } from "~/src/hooks/use-tiptap-editor-v2";
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

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);

  if (!editor?.isEditable) return null;

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        data-active-state={isActive ? "on" : "off"}
        tooltip="Ryhmittelykenttä"
        onClick={() => setOpen(true)}
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
