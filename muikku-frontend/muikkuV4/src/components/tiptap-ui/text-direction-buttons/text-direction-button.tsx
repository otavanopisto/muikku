/* eslint-disable react-x/no-forward-ref */
"use client";

import { forwardRef, useCallback } from "react";

import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button } from "@/components/tiptap-ui-primitive/button";
import {
  useTextDirection,
  type UseTextDirectionConfig,
} from "./use-text-direction";

type IconProps = React.SVGProps<SVGSVGElement>;
type IconComponent = ({ className, ...props }: IconProps) => React.ReactElement;

/**
 * TextDirectionButtonProps is the props for the TextDirectionButton component
 */
export interface TextDirectionButtonProps
  extends Omit<ButtonProps, "type">,
    UseTextDirectionConfig {
  text?: string;
  icon?: React.MemoExoticComponent<IconComponent> | React.FC<IconProps>;
}

/**
 * TextDirectionButton is the component for the text direction button
 */
export const TextDirectionButton = forwardRef<
  HTMLButtonElement,
  TextDirectionButtonProps
>(
  (
    {
      editor: providedEditor,
      direction,
      text,
      hideWhenUnavailable = false,
      onChanged,
      onClick,
      icon: CustomIcon,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);

    const { isVisible, isActive, canChange, handleChange, label, Icon } =
      useTextDirection({
        editor,
        direction,
        hideWhenUnavailable,
        onChanged,
      });

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleChange();
      },
      [handleChange, onClick]
    );

    if (!isVisible) return null;

    const RenderIcon = CustomIcon ?? Icon;

    return (
      <Button
        type="button"
        disabled={!canChange}
        variant="ghost"
        data-active-state={isActive ? "on" : "off"}
        data-disabled={!canChange}
        role="button"
        tabIndex={-1}
        aria-label={label}
        aria-pressed={isActive}
        tooltip={label}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <RenderIcon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
          </>
        )}
      </Button>
    );
  }
);

TextDirectionButton.displayName = "TextDirectionButton";
