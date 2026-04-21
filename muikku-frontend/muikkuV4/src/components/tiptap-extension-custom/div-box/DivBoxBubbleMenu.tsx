"use client";

import { useCallback, useMemo, useState } from "react";
import { BubbleMenu } from "@tiptap/react/menus";
import type { Editor } from "@tiptap/react";

import { Button } from "@/components/tiptap-ui-primitive/button";
import DivBoxModal from "./DivBoxModal";
import type { EditorState } from "@tiptap/pm/state";
import { Card, CardBody } from "@/components/tiptap-ui-primitive/card";
import { ButtonGroup } from "../../tiptap-ui-primitive/button-group";

/**
 * The DivBoxBubbleMenu component.
 * @param props - The props for the DivBoxBubbleMenu component.
 * @returns The DivBoxBubbleMenu component.
 */
export function DivBoxBubbleMenu({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);

  const options = useMemo(
    () => ({
      placement: "top" as const,
      offset: 8,
      shift: {
        padding: 8,
      },
    }),
    []
  );

  /**
   * shouldShow is the function to check if the div box bubble menu should be shown.
   * @param props - The props for the shouldShow function.
   * @returns True if the div box bubble menu should be shown, false otherwise.
   */
  const shouldShow = useCallback(
    ({ editor, state }: { editor: Editor; state: EditorState }) => {
      if (!editor.isEditable) return false;
      const { $from } = state.selection;
      for (let d = $from.depth; d > 0; d--) {
        if ($from.node(d).type.name === "divBox") return true;
      }
      return false;
    },
    []
  );

  return (
    <>
      <BubbleMenu editor={editor} options={options} shouldShow={shouldShow}>
        <Card
          style={{ boxShadow: "var(--tt-shadow, 0 10px 30px rgba(0,0,0,.12))" }}
        >
          <CardBody style={{ padding: 6 }}>
            <ButtonGroup>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(true)}
                tooltip="Properties"
              >
                Properties
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => editor.commands.unsetDivBox()}
                tooltip="Delete box"
              >
                Delete
              </Button>
            </ButtonGroup>
          </CardBody>
        </Card>
      </BubbleMenu>

      <DivBoxModal
        editor={editor}
        opened={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export default DivBoxBubbleMenu;
