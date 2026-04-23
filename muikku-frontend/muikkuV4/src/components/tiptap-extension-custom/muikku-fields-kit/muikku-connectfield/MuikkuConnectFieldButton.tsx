/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { useTiptapEditor } from "~/src/hooks/use-tiptap-editor";
import MuikkuConnectFieldModal from "./MuikkuConnectFieldModal";

const OPEN_EVENT = "muikku:open-muikku-connectfield-modal";

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
  const { editor } = useTiptapEditor(providedEditor);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);

  if (!editor?.isEditable) return null;

  const isActive = editor.isActive("muikkuConnectField");

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        data-active-state={isActive ? "on" : "off"}
        tooltip="Yhdistelykenttä"
        onClick={() => setOpen(true)}
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
        onClose={() => setOpen(false)}
      />
    </>
  );
});

export default MuikkuConnectFieldButton;
