/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useCallback } from "react";

import { useTiptapEditorV2 } from "@/hooks/use-tiptap-editor-v2";
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button } from "@/components/tiptap-ui-primitive/button";

import { useImageCaption, type UseImageCaptionConfig } from "./useImageCaption";

export type ImageCaptionButtonProps = Omit<ButtonProps, "type"> &
  UseImageCaptionConfig;

/**
 * ImageCaptionButton
 * @param props - The props.
 * @returns The ImageCaptionButton.
 */
export const ImageCaptionButton = forwardRef<
  HTMLButtonElement,
  ImageCaptionButtonProps
>(
  (
    {
      editor: providedEditor,
      hideWhenUnavailable = true,
      onToggled,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditorV2({ editor: providedEditor });
    const { isVisible, handleToggle, label, canToggle, isActive, Icon } =
      useImageCaption({ editor, hideWhenUnavailable, onToggled });

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleToggle();
      },
      [handleToggle, onClick]
    );

    if (!isVisible) {
      return null;
    }

    return (
      <Button
        type="button"
        disabled={!canToggle}
        variant="ghost"
        data-active-state={isActive ? "on" : "off"}
        data-disabled={!canToggle}
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
