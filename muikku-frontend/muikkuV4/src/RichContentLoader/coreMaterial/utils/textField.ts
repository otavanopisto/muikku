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
 * Whether the value matches any correct right-answer.
 * `null` = field is not checkable (no correct answers).
 */
export function isCorrectTextAnswer(
  value: string,
  content: TextFieldContent
): boolean | null {
  const keys = content.rightAnswers?.filter((row) => row.correct) ?? [];
  if (keys.length === 0) {
    return null;
  }
  return keys.some((row) => matchesRightAnswer(value, row));
}
