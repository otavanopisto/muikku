/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useCallback } from "react";
import type { Editor } from "@tiptap/react";

import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button } from "@/components/tiptap-ui-primitive/button";

import { useIndent, type IndentAction } from "./UseIndent";

/**
 * IndentButtonProps is the props for the IndentButton component.
 */
export interface IndentButtonProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
  action: IndentAction;
  hideWhenUnavailable?: boolean;
}

/**
 * IndentButton is the button component for the IndentExtension.
 */
export const IndentButton = forwardRef<HTMLButtonElement, IndentButtonProps>(
  (
    {
      editor,
      action,
      hideWhenUnavailable = false,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const { isVisible, canRun, handleIndent, label, Icon } = useIndent({
      editor,
      action,
      hideWhenUnavailable,
    });

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        handleIndent();
      },
      [onClick, handleIndent]
    );

    if (!isVisible) return null;

    return (
      <Button
        type="button"
        variant="ghost"
        disabled={!canRun}
        data-disabled={!canRun}
        aria-label={label}
        tooltip={label}
        tabIndex={-1}
        role="button"
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        {children ?? <Icon className="tiptap-button-icon" />}
      </Button>
    );
  }
);

IndentButton.displayName = "IndentButton";
