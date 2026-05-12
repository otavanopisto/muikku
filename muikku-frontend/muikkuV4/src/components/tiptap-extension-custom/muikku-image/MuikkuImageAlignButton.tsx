/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef } from "react";

import { useTiptapEditorV2 } from "@/hooks/use-tiptap-editor-v2";
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button } from "@/components/tiptap-ui-primitive/button";

import { useImageAlign, type UseImageAlignConfig } from "./useImageAlign";

export type ImageAlignButtonProps = Omit<ButtonProps, "type"> &
  UseImageAlignConfig;

/**
 * ImageAlignButton
 * @param props - The props.
 * @returns The ImageAlignButton.
 */
export const ImageAlignButton = forwardRef<
  HTMLButtonElement,
  ImageAlignButtonProps
>(
  (
    {
      editor: providedEditor,
      align,
      hideWhenUnavailable = true,
      onAligned,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditorV2({ editor: providedEditor });
    const { isVisible, handleAlign, label, canAlign, isActive, Icon } =
      useImageAlign({
        editor,
        align,
        hideWhenUnavailable,
        onAligned,
      });

    /**
     * The handleClick function.
     * @param event - The event.
     */
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      handleAlign();
    };

    if (!isVisible) {
      return null;
    }

    return (
      <Button
        type="button"
        disabled={!canAlign}
        variant="ghost"
        data-active-state={isActive ? "on" : "off"}
        data-disabled={!canAlign}
        role="button"
        tabIndex={-1}
        aria-label={label}
        aria-pressed={isActive}
        tooltip={label}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? <Icon className="tiptap-button-icon" />}
      </Button>
    );
  }
);
