/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";

import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { LinkIcon } from "@/components/tiptap-icons/link-icon";
import { useTiptapEditorV2 } from "~/src/hooks/use-tiptap-editor-v2";

import { MuikkuLinkSettingsModal } from "./MuikkuLinkSettingsModal";
import { OPEN_MUIKKU_LINK_SETTINGS_MODAL_EVENT } from "./MuikkuLinkExtension";

/**
 * MuikkuLinkButtonProps
 */
export interface MuikkuLinkButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

/**
 * MuikkuLinkButton
 * @param props - The props for the MuikkuLinkButton.
 * @returns The MuikkuLinkButton.
 */
export const MuikkuLinkButton = forwardRef<
  HTMLButtonElement,
  MuikkuLinkButtonProps
>(({ editor: providedEditor, children, ...buttonProps }, ref) => {
  const { editor } = useTiptapEditorV2({ editor: providedEditor });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openFromDblClick = () => setOpen(true);
    window.addEventListener(
      OPEN_MUIKKU_LINK_SETTINGS_MODAL_EVENT,
      openFromDblClick
    );
    return () =>
      window.removeEventListener(
        OPEN_MUIKKU_LINK_SETTINGS_MODAL_EVENT,
        openFromDblClick
      );
  }, []);

  if (!editor?.isEditable) return null;

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        aria-label="Link"
        tooltip="Link"
        onClick={() => setOpen(true)}
        tabIndex={-1}
        role="button"
        ref={ref}
        {...buttonProps}
      >
        {children ?? <LinkIcon className="tiptap-button-icon" />}
      </Button>

      <MuikkuLinkSettingsModal
        editor={editor}
        opened={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
});

MuikkuLinkButton.displayName = "MuikkuLinkButton";

export default MuikkuLinkButton;
