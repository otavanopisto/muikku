import type { MultiSelectFieldContent, SelectFieldContent } from "../types";

/**
 * Whether the selected option name is one of the correct options.
 * `null` = field is not checkable (no correct options).
 * @param value - Saved option name
 * @param content - Field definition
 */
export function isCorrectSelectAnswer(
  value: string,
  content: SelectFieldContent
): boolean | null {
  const keys = content.options?.filter((option) => option.correct) ?? [];
  if (keys.length === 0) {
    return null;
  }
  return keys.some((option) => option.name === value);
}

/**
 * Parse saved multiselect JSON `[optionName, …]`.
 * @param initialValue - Composite-reply JSON
 */
export function parseMultiSelectAnswer(initialValue?: string): string[] {
  if (!initialValue) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(initialValue);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((name): name is string => typeof name === "string")
      .sort();
  } catch {
    return [];
  }
}

/**
 * Toggle an option name in a sorted unique list.
 * @param values - Current names
 * @param optionName - Option to add or remove
 */
export function toggleMultiSelectValue(
  values: readonly string[],
  optionName: string
): string[] {
  if (values.includes(optionName)) {
    return values.filter((name) => name !== optionName);
  }
  return [...values, optionName].sort();
}

/**
 * Per-option PASS/FAIL. A wrong extra check and a missing correct check both FAIL.
 * `null` = field is not checkable.
 * @param values - Selected option names
 * @param content - Field definition
 */
export function checkMultiSelectAnswers(
  values: readonly string[],
  content: MultiSelectFieldContent
): ("PASS" | "FAIL")[] | null {
  const keys = content.options?.filter((option) => option.correct) ?? [];
  if (keys.length === 0) {
    return null;
  }
  return content.options.map((option) => {
    const checked = values.includes(option.name);
    return option.correct === checked ? "PASS" : "FAIL";
  });
}

/**
 * Whether every option matched. `null` = not checkable.
 * @param values - Selected option names
 * @param content - Field definition
 */
export function isCorrectMultiSelectAnswer(
  values: readonly string[],
  content: MultiSelectFieldContent
): boolean | null {
  const rows = checkMultiSelectAnswers(values, content);
  if (rows === null) {
    return null;
  }
  return !rows.includes("FAIL");
}
