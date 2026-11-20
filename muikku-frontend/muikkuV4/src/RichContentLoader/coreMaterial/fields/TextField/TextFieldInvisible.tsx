import { TextInput } from "@mantine/core";
import type { TextFieldContent } from "../../types";
import { TextAnswerSummary } from "./TextAnswerSummary";

/**
 * Shared layout placeholder (V3 invisible branch, same for materials + evaluation).
 */
export function TextFieldInvisible(props: {
  inputWidth: string;
  content: TextFieldContent;
  displayCorrectAnswers?: boolean;
  checkResult?: boolean | null;
}) {
  const { inputWidth, content, displayCorrectAnswers, checkResult } = props;
  return (
    <span className="material-page__textfield-wrapper" aria-hidden>
      <TextInput
        className="material-page__textfield"
        name={content.name}
        value={""}
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
