import { TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import type {
  FieldComponentProps,
  TextFieldContent,
} from "../../coreMaterial/types";
import { isCorrectTextAnswer } from "../../coreMaterial/utils/textField";
import { TextAnswerSummary } from "../../coreMaterial/fields/TextField/TextAnswerSummary";
import { TextFieldInvisible } from "../../coreMaterial/fields/TextField/TextFieldInvisible";
import { Synchronizer } from "../../coreMaterial/fields/Synchronizer";
import { useFieldSyncHandle } from "../../coreMaterial/hooks/useFieldSyncHandle";

/**
 * TextFieldProps
 */
interface TextFieldProps extends FieldComponentProps<TextFieldContent> {}

/**
 * Student materials text field. Evaluation has its own loader field.
 * @param props - Field props (live check/show flags from FieldWithLiveProps)
 */
export function MaterialTextField(props: TextFieldProps) {
  const {
    content,
    readOnly,
    initialValue,
    invisible,
    displayCorrectAnswers,
    checkAnswers,
    onAnswerChange,
    onChange,
  } = props;

  const [value, setValue] = useState(initialValue ?? "");
  const handle = useFieldSyncHandle();

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

  /**
   * Persist on each keystroke; field manager debounces the websocket save.
   */
  function handleChange(next: string) {
    setValue(next);
    onChange?.(handle, content?.name ?? "", next);
  }

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
        readOnly={readOnly}
        disabled={readOnly}
        autoComplete="off"
        spellCheck={false}
        onChange={(event) => handleChange(event.currentTarget.value)}
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
      <Synchronizer
        modified={handle.state.modified}
        synced={handle.state.synced}
        syncError={handle.state.syncError}
      />
      <TextAnswerSummary
        content={content}
        visible={displayCorrectAnswers}
        checkResult={checkResult}
      />
    </span>
  );
}
