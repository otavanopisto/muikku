import * as React from "react";
import type {
  FieldRegistry,
  MaterialProcessingContext,
  FieldComponentProps,
  FieldContent,
} from "../types";
import { FieldWithLiveProps } from "../fields/FieldWithLiveProps";

/**
 * Creates a field React element from an object tag using an injectable registry.
 * Live check/show props are resolved by FieldWithLiveProps from material context.
 */
export function createFieldElement(
  element: HTMLElement,
  context: MaterialProcessingContext,
  registry: FieldRegistry,
  key?: number
): React.ReactElement {
  const fieldType = element.getAttribute("type") ?? "";
  const entry = registry[fieldType];
  if (!entry) {
    return (
      <span key={key}>
        Invalid Element {fieldType} {element.innerHTML}
      </span>
    );
  }
  const parameters = entry.processor(element, context);
  const stableKey = parameters.content?.name ?? key;
  const fieldProps: FieldComponentProps<FieldContent> = {
    content: parameters.content,
    // Structural / initial only — live flags come from FieldWithLiveProps
    readOnly: parameters.readOnly,
    initialValue: parameters.initialValue,
    onChange: parameters.onChange,
    invisible: parameters.invisible,
    userId: parameters.userId,
  };
  return (
    <FieldWithLiveProps
      key={stableKey}
      Field={entry.component}
      fieldProps={fieldProps}
    />
  );
}
