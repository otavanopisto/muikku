/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useCallback, useState } from "react";
import { Editor } from "@tiptap/react";
import {
  Button,
  type ButtonProps,
} from "@/components/tiptap-ui-primitive/button";
import { MuikkuImagePropertiesModal } from "./MuikkuImagePropertiesModal";
import { useTiptapEditorV2 } from "@/hooks/use-tiptap-editor-v2";
import { useCallbackOnEvent } from "@/hooks/use-callback-on-event";
import { OPEN_IMAGE_PROPERTIES_MODAL_EVENT } from "./helpers";

/**
 * The ImageAddButton props interface.
 */
interface ImageAddButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

/**
 * The ImageAddButton component.
 * @param props - The props for the ImageAddButton component.
 * @returns The ImageAddButton component.
 */
export const ImageAddButton = forwardRef<
  HTMLButtonElement,
  ImageAddButtonProps
>((props, ref) => {
  const { editor: providedEditor, disabled, ...buttonProps } = props;
  const { editor } = useTiptapEditorV2({
    editor: providedEditor,
  });

  const [opened, setOpened] = useState(false);

  useCallbackOnEvent(OPEN_IMAGE_PROPERTIES_MODAL_EVENT, () => setOpened(true));

  /**
   * The handleOpen function.
   */
  const handleOpen = useCallback(() => {
    if (!editor?.isEditable) return;
    editor.chain().focus().run();
    setOpened(true);
  }, [editor]);

  if (!editor?.isEditable) return null;

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        data-active-state={opened ? "on" : "off"}
        tooltip="Lisää kuva"
        onClick={handleOpen}
        tabIndex={-1}
        role="button"
        ref={ref}
        {...buttonProps}
      >
        Lisää kuva
      </Button>

      <MuikkuImagePropertiesModal
        editor={editor}
        opened={opened}
        onClose={() => setOpened(false)}
      />
    </>
  );
});
