"use client";

import type { TextDirectionButtonProps } from "./text-direction-button";
import { TextDirectionButton } from "./text-direction-button";

/**
 * TextDirectionRightButton is the component for the text direction right button
 * @param props - The props for the TextDirectionRightButton component
 * @returns The TextDirectionRightButton component
 */
export function TextDirectionRightButton(
  props: Omit<TextDirectionButtonProps, "direction">
) {
  return <TextDirectionButton direction="rtl" {...props} />;
}
