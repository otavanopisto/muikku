import type { TextFieldContent } from "../types";

/**
 * Compare a student value to one right-answer row.
 */
function matchesRightAnswer(
  value: string,
  answer: TextFieldContent["rightAnswers"][number]
): boolean {
  let expected = answer.text ?? "";
  let got = value;
  if (answer.normalizeWhitespace) {
    expected = expected.replace(/\s+/g, " ").trim();
    got = got.replace(/\s+/g, " ").trim();
  }
  if (!answer.caseSensitive) {
    expected = expected.toLocaleLowerCase();
    got = got.toLocaleLowerCase();
  }
  return got === expected;
}

/**
 * Whether the value matches any actually-correct right-answer.
 * `null` = field is not checkable (no correct answers).
 */
export function isCorrectTextAnswer(
  value: string,
  content: TextFieldContent
): boolean | null {
  const actuallyCorrectAnswers =
    content.rightAnswers?.filter((row) => row.correct) ?? [];
  if (actuallyCorrectAnswers.length === 0) {
    return null;
  }
  return actuallyCorrectAnswers.some((row) => matchesRightAnswer(value, row));
}

export type TextAnswerSummaryKind = "correct" | "example";

/**
 * Text answer summary data.
 */
export interface TextAnswerSummaryData {
  kind: TextAnswerSummaryKind;
  answers: string[];
}

/**
 * Answers shown next to the field when displayCorrectAnswers is on.
 * Correct rows if any are flagged; otherwise all rightAnswers as examples (V3).
 */
export function getTextAnswerSummary(
  content: TextFieldContent
): TextAnswerSummaryData | null {
  const rightAnswers = content.rightAnswers ?? [];
  if (rightAnswers.length === 0) {
    return null;
  }
  const actuallyCorrectAnswers = rightAnswers.filter((row) => row.correct);
  if (actuallyCorrectAnswers.length > 0) {
    return {
      kind: "correct",
      answers: actuallyCorrectAnswers.map((row) => row.text),
    };
  }
  return {
    kind: "example",
    answers: rightAnswers.map((row) => row.text),
  };
}
