/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useMemo, useState } from "react";
import type { Editor } from "@tiptap/react";

import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button } from "@/components/tiptap-ui-primitive/button";
import { Input } from "@/components/tiptap-ui-primitive/input";
import { Label } from "@/components/tiptap-ui-primitive/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/tiptap-ui-primitive/popover";
import { Separator } from "@/components/tiptap-ui-primitive/separator";
import {
  Card,
  CardBody,
  CardGroupLabel,
  CardItemGroup,
} from "@/components/tiptap-ui-primitive/card";

import { TableIcon } from "@/components/tiptap-icons/table-icon";

/**
 * TablePopoverProps is the props for the TablePopover component
 */
export interface TablePopoverProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
}

/**
 * TablePopoverButton is the button for the TablePopover component
 */
export const TablePopoverButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => (
    <Button
      type="button"
      className={className}
      variant="ghost"
      data-appearance="default"
      role="button"
      tabIndex={-1}
      aria-label="Insert table"
      tooltip="Insert table"
      ref={ref}
      {...props}
    >
      {children ?? <TableIcon className="tiptap-button-icon" />}
    </Button>
  )
);

TablePopoverButton.displayName = "TablePopoverButton";

/**
 * clampInt clamps an integer value between a minimum and maximum value
 * @param value - The value to clamp
 * @param min - The minimum value
 * @param max - The maximum value
 * @returns The clamped value
 */
function clampInt(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.trunc(value)));
}

/**
 * TablePopover is the component for the TablePopover component
 * @param props - The props for the TablePopover component
 * @returns The TablePopover component
 */
export function TablePopover({
  editor: providedEditor,
  ...props
}: TablePopoverProps) {
  const { editor } = useTiptapEditor(providedEditor);
  const [open, setOpen] = useState(false);

  const [rowsInput, setRowsInput] = useState("3");
  const [colsInput, setColsInput] = useState("3");

  const canInsert = useMemo(() => {
    if (!editor?.isEditable) return false;
    // `insertTable` exists when TableKit is enabled
    return editor.can().insertTable({ rows: 1, cols: 1, withHeaderRow: false });
  }, [editor]);

  const rows = clampInt(Number(rowsInput || 0), 1, 20);
  const cols = clampInt(Number(colsInput || 0), 1, 20);

  const handleInsert = () => {
    if (!editor?.isEditable) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: false })
      .run();
    setOpen(false);
  };

  if (!editor) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <TablePopoverButton
          disabled={!canInsert}
          data-disabled={!canInsert}
          aria-pressed={open}
          {...props}
        />
      </PopoverTrigger>

      <PopoverContent aria-label="Insert table">
        <Card style={{ minWidth: 240 }}>
          <CardBody>
            <CardGroupLabel>Rows</CardGroupLabel>
            <CardItemGroup orientation="horizontal">
              <Input
                type="number"
                inputMode="numeric"
                min={1}
                max={20}
                value={rowsInput}
                onChange={(e) => setRowsInput(e.target.value)}
              />
            </CardItemGroup>

            <CardGroupLabel>Columns</CardGroupLabel>
            <CardItemGroup orientation="horizontal">
              <Input
                id="tiptap-table-cols"
                type="number"
                inputMode="numeric"
                min={1}
                max={20}
                value={colsInput}
                onChange={(e) => setColsInput(e.target.value)}
              />
            </CardItemGroup>
            <CardItemGroup orientation="horizontal">
              <Button
                type="button"
                variant="primary"
                disabled={!canInsert}
                data-disabled={!canInsert}
                onClick={handleInsert}
              >
                Insert {rows} × {cols}
              </Button>
            </CardItemGroup>
          </CardBody>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

export default TablePopover;
