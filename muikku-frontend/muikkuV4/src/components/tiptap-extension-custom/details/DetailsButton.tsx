/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useCallback } from "react";
import type { Editor } from "@tiptap/react";

import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button } from "@/components/tiptap-ui-primitive/button";

import { ChevronDownIcon } from "@/components/tiptap-icons/chevron-down-icon";

/**
 * DetailsButtonProps is the props for the DetailsButton component.
 */
export interface DetailsButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
  /**
   * Optional initial summary text.
   * @default "Yhteenveto"
   */
  summary?: string;
  /**
   * Optional set initial open state.
   * Default behavior comes from the extension option `openByDefault`.
   */
  open?: boolean;
}

/**
 * DetailsButton is the button component for the DetailsExtension.
 */
export const DetailsButton = forwardRef<HTMLButtonElement, DetailsButtonProps>(
  (
    { editor: providedEditor, summary, open, onClick, children, ...props },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);

    const canInsert =
      !!editor?.isEditable &&
      // guard: only enable if command exists (extension loaded)
      typeof editor?.commands?.insertDetails === "function";

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (!editor?.isEditable) return;

        editor
          .chain()
          .focus()
          .insertContent({
            type: "details",
            attrs:
              typeof open === "boolean" ? { open: open ? true : null } : {},
            content: [
              {
                type: "detailsSummary",
                content: [{ type: "text", text: summary ?? "Yhteenveto" }],
              },
              { type: "detailsContent", content: [{ type: "paragraph" }] },
            ],
          })
          .run();
      },
      [editor, onClick, summary, open]
    );

    if (!editor?.isEditable) return null;

    return (
      <Button
        type="button"
        variant="ghost"
        disabled={!canInsert}
        data-disabled={!canInsert}
        aria-label="Insert details"
        tooltip="Details"
        onClick={handleClick}
        tabIndex={-1}
        role="button"
        ref={ref}
        {...props}
      >
        {children ?? <ChevronDownIcon className="tiptap-button-icon" />}
      </Button>
    );
  }
);

DetailsButton.displayName = "DetailsButton";

export default DetailsButton;
