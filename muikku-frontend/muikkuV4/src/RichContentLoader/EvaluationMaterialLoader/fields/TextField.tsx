import { useEffect } from "react";
import type {
  FieldComponentProps,
  TextFieldContent,
} from "../../coreMaterial/types";
import { isCorrectTextAnswer } from "../../coreMaterial/utils/textField";
import { TextAnswerSummary } from "../../coreMaterial/fields/TextField/TextAnswerSummary";
import { TextFieldInvisible } from "../../coreMaterial/fields/TextField/TextFieldInvisible";
import { TextInput } from "@mantine/core";

/**
 * TextFieldProps
 */
interface TextFieldProps extends FieldComponentProps<TextFieldContent> {}

/**
 * Evaluation text field: display span (not an input). Invisible layout is shared.
 * @param props - Live field props from FieldWithLiveProps
 */
export function EvaluationTextField(props: TextFieldProps) {
  const {
    content,
    initialValue,
    invisible,
    displayCorrectAnswers,
    checkAnswers,
    onAnswerChange,
  } = props;

  const value = initialValue ?? "";
  const checkResult =
    content && checkAnswers ? isCorrectTextAnswer(value, content) : null;

  useEffect(() => {
    if (!content?.name || !checkAnswers) {
      return;
    }
    if (checkResult === null) {
      return;
    }
    onAnswerChange?.(content.name, checkResult);
  }, [checkAnswers, checkResult, content?.name, onAnswerChange]);

  if (!content) {
    return null;
  }

  const columns = Number.parseInt(content.columns, 10);
  const widthCh = Number.isFinite(columns) && columns > 0 ? columns : 20;
  const inputWidth = content.autogrow
    ? `${Math.max(widthCh, value.length + 1)}ch`
    : `${widthCh}ch`;

  if (invisible) {
    return (
      <TextFieldInvisible
        inputWidth={inputWidth}
        content={content}
        displayCorrectAnswers={displayCorrectAnswers}
        checkResult={checkResult}
      />
    );
  }

  return (
    <span className="material-page__textfield-wrapper">
      <TextInput
        className="material-page__textfield"
        name={content.name}
        value={value}
        placeholder={content.hint || undefined}
        readOnly={true}
        disabled={true}
        autoComplete="off"
        spellCheck={false}
        styles={{
          root: { display: "inline-block", width: inputWidth },
          input: {
            borderColor:
              checkResult === true
                ? "var(--mantine-color-green-6)"
                : checkResult === false
                  ? "var(--mantine-color-red-6)"
                  : undefined,
          },
        }}
      />
      <TextAnswerSummary
        content={content}
        visible={displayCorrectAnswers}
        checkResult={checkResult}
      />
    </span>
  );
}
