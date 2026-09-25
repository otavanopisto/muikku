import * as React from "react";
import type {
  FieldRegistry,
  MaterialProcessingContext,
  FieldComponentProps,
  FieldContent,
} from "../types";

/**
 * Creates a field React element from an object tag using an injectable registry.
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

  const componentProps: FieldComponentProps<FieldContent> = {
    content: parameters.content,
    readOnly: parameters.readOnly,
    initialValue: parameters.initialValue,
    onChange: parameters.onChange,
    displayCorrectAnswers: parameters.displayCorrectAnswers,
    checkAnswers: parameters.checkAnswers,
    onAnswerChange: parameters.onAnswerChange,
    invisible: parameters.invisible,
    userId: parameters.userId,
  };

  return React.createElement(entry.component, {
    ...componentProps,
    key,
  });
}
