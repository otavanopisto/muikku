"use client";

import { useCallback, useState } from "react";
import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Button } from "@/components/tiptap-ui-primitive/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/tiptap-ui-primitive/button-group";
import { Card, CardBody } from "@/components/tiptap-ui-primitive/card";
import { TrashIcon } from "@/components/tiptap-icons/trash-icon";
import { DeleteRowIcon } from "@/components/tiptap-icons/delete-row-icon";
import { DeleteColumnIcon } from "@/components/tiptap-icons/delete-column-icon";
import { CogIcon } from "@/components/tiptap-icons/cog-icon";
import type { EditorState } from "@tiptap/pm/state";
import { Spacer } from "../../tiptap-ui-primitive/spacer";

/**
 * TableBubbleMenuProps is the props for the TableBubbleMenu component
 */
export interface TableBubbleMenuProps {
  editor: Editor;
}

/**
 * TableBubbleMenu is the component for the TableBubbleMenu component
 * @param props - The props for the TableBubbleMenu component
 * @returns The TableBubbleMenu component
 */
export function TableBubbleMenu({ editor }: TableBubbleMenuProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) return { isTable: false, selection: null };
      return {
        isTable: editor.isActive("table"),
        selection: editor.state.selection,
      };
    },
  });

  const shouldShow = useCallback(
    ({ editor, state }: { editor: Editor; state: EditorState }) => {
      if (!editor.isEditable) return false;
      // Determine if we’re inside a table from the *current* state
      const $from = state.selection.$from;
      for (let d = $from.depth; d > 0; d--) {
        if ($from.node(d).type.name === "table") return true;
      }
      return false;
    },
    []
  );

  const can = editor?.isEditable
    ? {
        rowBefore: editor.can().addRowBefore(),
        rowAfter: editor.can().addRowAfter(),
        colBefore: editor.can().addColumnBefore(),
        colAfter: editor.can().addColumnAfter(),
        delRow: editor.can().deleteRow(),
        delCol: editor.can().deleteColumn(),
        delTable: editor.can().deleteTable(),
      }
    : {
        rowBefore: false,
        rowAfter: false,
        colBefore: false,
        colAfter: false,
        delRow: false,
        delCol: false,
        delTable: false,
      };

  const run =
    (fn: () => boolean) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      fn();
    };

  const addRowBefore = () => editor.chain().focus().addRowBefore().run();
  const addRowAfter = () => editor.chain().focus().addRowAfter().run();
  const addColumnBefore = () => editor.chain().focus().addColumnBefore().run();
  const addColumnAfter = () => editor.chain().focus().addColumnAfter().run();

  const deleteRow = () => editor.chain().focus().deleteRow().run();
  const deleteColumn = () => editor.chain().focus().deleteColumn().run();
  const deleteTable = () => editor.chain().focus().deleteTable().run();

  const mergeCells = () => editor.chain().focus().mergeCells().run();
  const splitCell = () => editor.chain().focus().splitCell().run();
  const toggleHeaderRow = () => editor.chain().focus().toggleHeaderRow().run();
  const toggleHeaderColumn = () =>
    editor.chain().focus().toggleHeaderColumn().run();
  const toggleHeaderCell = () =>
    editor.chain().focus().toggleHeaderCell().run();

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      // Offset so it sits above caret/cell and doesn’t cover typing
      options={{
        strategy: "fixed",
        placement: "top",
        offset: {
          mainAxis: 8,
        },
        shift: {
          padding: 8,
        },
      }}
      updateDelay={0}
    >
      <Card
        style={{ boxShadow: "var(--tt-shadow, 0 10px 30px rgba(0,0,0,.12))" }}
      >
        <CardBody style={{ padding: 6 }}>
          <ButtonGroup>
            <Button
              type="button"
              variant="ghost"
              disabled={!can.rowBefore}
              data-disabled={!can.rowBefore}
              tooltip="Add row above"
              onClick={run(addRowBefore)}
            >
              +↑
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={!can.rowAfter}
              data-disabled={!can.rowAfter}
              tooltip="Add row below"
              onClick={run(addRowAfter)}
            >
              +↓
            </Button>

            <ButtonGroupSeparator />

            <Button
              type="button"
              variant="ghost"
              disabled={!can.colBefore}
              data-disabled={!can.colBefore}
              tooltip="Add column left"
              onClick={run(addColumnBefore)}
            >
              +←
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={!can.colAfter}
              data-disabled={!can.colAfter}
              tooltip="Add column right"
              onClick={run(addColumnAfter)}
            >
              +→
            </Button>

            <ButtonGroupSeparator />

            <Button
              type="button"
              variant="ghost"
              disabled={!can.delRow}
              data-disabled={!can.delRow}
              tooltip="Delete row"
              onClick={run(deleteRow)}
            >
              <DeleteRowIcon className="tiptap-button-icon" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={!can.delCol}
              data-disabled={!can.delCol}
              tooltip="Delete column"
              onClick={run(deleteColumn)}
            >
              <DeleteColumnIcon className="tiptap-button-icon" />
            </Button>

            <Spacer size={8} />

            <Button
              type="button"
              variant="ghost"
              disabled={!can.delTable}
              data-disabled={!can.delTable}
              tooltip="Delete table"
              onClick={run(deleteTable)}
            >
              <TrashIcon className="tiptap-button-icon" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              aria-label="Advanced table actions"
              aria-pressed={showAdvanced}
              data-active-state={showAdvanced ? "on" : "off"}
              tooltip="Advanced"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowAdvanced((v) => !v);
              }}
            >
              {/* CogIcon or text */}
              <CogIcon className="tiptap-button-icon" />
            </Button>
          </ButtonGroup>

          {showAdvanced && (
            <>
              <ButtonGroupSeparator orientation="horizontal" />
              <ButtonGroup>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={run(mergeCells)}
                  disabled={!editor.can().mergeCells()}
                >
                  Merge
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={run(splitCell)}
                  disabled={!editor.can().splitCell()}
                >
                  Split
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={run(toggleHeaderRow)}
                  disabled={!editor.can().toggleHeaderRow()}
                >
                  Header row
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={run(toggleHeaderColumn)}
                  disabled={!editor.can().toggleHeaderColumn()}
                >
                  Header column
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={run(toggleHeaderCell)}
                  disabled={!editor.can().toggleHeaderCell()}
                >
                  Header cell
                </Button>
              </ButtonGroup>
            </>
          )}
        </CardBody>
      </Card>
    </BubbleMenu>
  );
}

export default TableBubbleMenu;
