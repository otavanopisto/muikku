import { Text, TextInput } from "@mantine/core";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import type {
  FieldComponentProps,
  TextFieldContent,
} from "../../coreMaterial/types";
import { isCorrectTextAnswer } from "../../coreMaterial/utils/createFieldParameters";

/**
 * TextFieldProps
 */
interface TextFieldProps extends FieldComponentProps<TextFieldContent> {}

/**
 * FieldSyncState
 */
interface FieldSyncState {
  modified: boolean;
  synced: boolean;
  syncError: string | null;
}

/**
 * Class-component-shaped handle for useFieldManager (synced / modified / error).
 */
function useFieldSyncHandle() {
  const syncRef = useRef<FieldSyncState>({
    modified: false,
    synced: true,
    syncError: null,
  });
  const [, bump] = useReducer((n: number) => n + 1, 0);

  return useMemo(
    () => ({
      get state() {
        return syncRef.current;
      },
      setState(update: Partial<FieldSyncState>) {
        syncRef.current = { ...syncRef.current, ...update };
        bump();
      },
    }),
    []
  );
}

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

  useEffect(() => {
    setValue(initialValue ?? "");
  }, [initialValue]);

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

  const examples =
    content.rightAnswers?.filter((row) => row.correct).map((row) => row.text) ??
    [];

  /**
   * Persist on each keystroke; field manager debounces the websocket save.
   */
  function handleChange(next: string) {
    setValue(next);
    onChange?.(handle, content?.name ?? "", next);
  }

  if (invisible) {
    return (
      <span className="material-page__textfield-wrapper" aria-hidden>
        <span
          style={{
            visibility: "hidden",
            display: "inline-block",
            width: inputWidth,
          }}
        >
          {value || " ".repeat(widthCh)}
        </span>
      </span>
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
        error={handle.state.syncError ?? undefined}
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
      {displayCorrectAnswers && examples.length > 0 && (
        <Text span size="xs" c="green" ml="xs">
          {examples.join(" / ")}
        </Text>
      )}
    </span>
  );
}
