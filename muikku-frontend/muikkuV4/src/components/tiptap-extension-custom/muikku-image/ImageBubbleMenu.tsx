"use client";

import { useCallback, useMemo } from "react";
import type { Editor } from "@tiptap/react";
import type { EditorState } from "@tiptap/pm/state";
import { BubbleMenu } from "@tiptap/react/menus";

import { Button } from "@/components/tiptap-ui-primitive/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/tiptap-ui-primitive/button-group";
import { Card, CardBody } from "@/components/tiptap-ui-primitive/card";

import { ImageAlignButton } from "@/components/tiptap-extension-custom/muikku-image/MuikkuImageAlignButton";
import { ImageCaptionButton } from "@/components/tiptap-extension-custom/muikku-image/MuikkuImageCaptionButton";
import { CogIcon } from "@/components/tiptap-icons/cog-icon";
import { OPEN_IMAGE_PROPERTIES_MODAL_EVENT } from "./helpers";

/**
 * The ImageBubbleMenu component.
 * @param props - The props for the ImageBubbleMenu component.
 * @param props.editor - The editor to use.
 * @returns
 */
export function ImageBubbleMenu(props: { editor: Editor }) {
  const { editor } = props;

  const options = useMemo(
    () => ({
      strategy: "fixed" as const,
      placement: "top" as const,
      offset: { mainAxis: 8 },
      shift: { padding: 8 },
    }),
    []
  );

  /**
   * Should show the image bubble menu.
   * @param editor - The editor.
   * @param state - The state.
   * @returns True if the image bubble menu should be shown, false otherwise.
   */
  const shouldShow = useCallback(
    ({ editor, state }: { editor: Editor; state: EditorState }) => {
      if (!editor.isEditable) return false;

      // show only when an image-like node is active/selected
      if (editor.isActive("image") || editor.isActive("imageFigure"))
        return true;

      // also handle selection inside caption text (walk ancestors)
      const $from = state.selection.$from;
      for (let d = $from.depth; d > 0; d--) {
        const name = $from.node(d).type.name;
        if (name === "imageFigure") return true;
      }

      return false;
    },
    []
  );

  /**
   * Runs the function.
   * @param fn - The function to run.
   * @returns The function to run.
   */
  const run = (fn: () => void) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
  };

  /**
   * Opens the image properties modal.
   */
  const openProperties = () => {
    window.dispatchEvent(new Event(OPEN_IMAGE_PROPERTIES_MODAL_EVENT));
  };

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      options={options}
      updateDelay={0}
    >
      <Card
        style={{ boxShadow: "var(--tt-shadow, 0 10px 30px rgba(0,0,0,.12))" }}
      >
        <CardBody style={{ padding: 6 }}>
          <ButtonGroup>
            {/* Align */}
            <ImageAlignButton align="left" editor={editor} />
            <ImageAlignButton align="center" editor={editor} />
            <ImageAlignButton align="right" editor={editor} />
            <ImageAlignButton align="none" editor={editor} />

            <ButtonGroupSeparator />

            {/* Caption */}
            <ImageCaptionButton editor={editor} />

            <ButtonGroupSeparator />

            {/* Properties */}
            <Button
              type="button"
              variant="ghost"
              tooltip="Kuvan ominaisuudet"
              onClick={run(openProperties)}
            >
              <CogIcon className="tiptap-button-icon" />
            </Button>
          </ButtonGroup>
        </CardBody>
      </Card>
    </BubbleMenu>
  );
}

export default ImageBubbleMenu;
