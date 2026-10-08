import type { ComponentType } from "react";
import { useMaterialContentContext } from "../MaterialContentProvider";
import type { FieldComponentProps, FieldContent } from "../types";

/**
 * Wraps a field so check/show/readOnly/onAnswerChange come from material
 * context at render time — not baked in at HTML→React convert time.
 */
export function FieldWithLiveProps<
  TContent extends FieldContent = FieldContent,
>({
  Field,
  fieldProps,
}: {
  Field: ComponentType<FieldComponentProps<TContent>>;
  fieldProps: FieldComponentProps<TContent>;
}) {
  const { readOnly, answersVisible, answersChecked, onAnswerChange } =
    useMaterialContentContext();

  return (
    <Field
      {...fieldProps}
      readOnly={readOnly}
      displayCorrectAnswers={answersVisible}
      checkAnswers={answersChecked}
      onAnswerChange={onAnswerChange}
    />
  );
}
