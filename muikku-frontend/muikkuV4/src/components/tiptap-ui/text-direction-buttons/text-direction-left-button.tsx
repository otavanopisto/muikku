"use client";

import type { TextDirectionButtonProps } from "./text-direction-button";
import { TextDirectionButton } from "./text-direction-button";

/**
 * TextDirectionLeftButton is the component for the text direction left button
 * @param props - The props for the TextDirectionLeftButton component
 * @returns The TextDirectionLeftButton component
 */
export function TextDirectionLeftButton(
  props: Omit<TextDirectionButtonProps, "direction">
) {
  return <TextDirectionButton direction="ltr" {...props} />;
}
