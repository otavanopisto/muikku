/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { useTiptapEditor } from "~/src/hooks/use-tiptap-editor";
import MuikkuOrganizerFieldModal from "./MuikkuOrganizerFieldModal";

const OPEN_EVENT = "muikku:open-muikku-organizerfield-modal";

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
  const { editor } = useTiptapEditor(providedEditor);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);

  if (!editor?.isEditable) return null;

  const isActive = editor.isActive("muikkuOrganizerField");

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

export default MuikkuOrganizerFieldButton;
