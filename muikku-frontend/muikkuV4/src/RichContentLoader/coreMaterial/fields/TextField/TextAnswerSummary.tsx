import { Text } from "@mantine/core";
import type { TextFieldContent } from "../../types";
import { getTextAnswerSummary } from "../../utils/textField";

const SUMMARY_LABEL: Record<"correct" | "example", string> = {
  correct: "Oikea vastaus",
  example: "Esimerkkivastaus",
};

/**
 * Revealed answers next to a text field (V3 correctAnswersummaryComponent).
 * Hidden when the student already answered correctly.
 */
export function TextAnswerSummary(props: {
  content: TextFieldContent;
  visible?: boolean;
  checkResult?: boolean | null;
}) {
  if (!props.visible || props.checkResult === true) {
    return null;
  }

  const summary = getTextAnswerSummary(props.content);
  if (!summary) {
    return null;
  }

  return (
    <Text span size="xs" c="green" ml="xs">
      {SUMMARY_LABEL[summary.kind]}: {summary.answers.join(" / ")}
    </Text>
  );
}
