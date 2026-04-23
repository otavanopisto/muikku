/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { useTiptapEditor } from "~/src/hooks/use-tiptap-editor";
import MuikkuSorterFieldModal from "./MuikkuSorterFieldModal";

const OPEN_EVENT = "muikku:open-muikku-sorterfield-modal";

/**
 * The Muikku sorter field button props interface.
 */
export interface MuikkuSorterFieldButtonProps
  extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

/**
 * The Muikku sorter field button component.
 * @param props - The props for the Muikku sorter field button component.
 * @returns The Muikku sorter field button component.
 */
export const MuikkuSorterFieldButton = forwardRef<
  HTMLButtonElement,
  MuikkuSorterFieldButtonProps
>(({ editor: providedEditor, ...buttonProps }, ref) => {
  const { editor } = useTiptapEditor(providedEditor);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);

  if (!editor?.isEditable) return null;

  const isActive = editor.isActive("muikkuSorterField");

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        data-active-state={isActive ? "on" : "off"}
        tooltip="Järjestelykenttä"
        onClick={() => setOpen(true)}
        tabIndex={-1}
        role="button"
        ref={ref}
        {...buttonProps}
      >
        Järjestelykenttä
      </Button>

      <MuikkuSorterFieldModal
        editor={editor}
        opened={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
});

export default MuikkuSorterFieldButton;
