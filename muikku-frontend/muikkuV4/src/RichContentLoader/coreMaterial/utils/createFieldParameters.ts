import type {
  FieldContent,
  FieldParameters,
  MaterialProcessingContext,
  MultiSelectFieldContent,
  SelectFieldContent,
  TextFieldContent,
} from "../types";

/**
 * Parse JSON field content from <object><param>…</param></object>
 */
export function parseFieldContent(element: HTMLElement): FieldContent | null {
  const parameters: Record<string, string> = {};

  element.querySelectorAll("param").forEach((node) => {
    const name = node.getAttribute("name");
    const value = node.getAttribute("value");
    if (name && value) {
      parameters[name] = value;
    }
  });

  if (parameters.type === "application/json" && parameters.content) {
    try {
      return JSON.parse(parameters.content) as FieldContent;
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Resolve initial answer value from composite replies
 */
export function getInitialValue(
  content: FieldContent | null,
  context: MaterialProcessingContext
) {
  if (!context.compositeReplies?.answers || !content) {
    return;
  }

  const answer = context.compositeReplies.answers.find(
    (a) => a.fieldName === content.name
  );

  if (!answer) {
    return;
  }

  if (typeof answer.value !== "undefined") {
    return answer.value;
  }

  return answer;
}

/**
 * Shared field parameter builder for all field registry entries
 */
export function createFieldParameters(
  element: HTMLElement,
  context: MaterialProcessingContext
): FieldParameters {
  const content = parseFieldContent(element);

  let initialValue = getInitialValue(content, context);

  if (typeof initialValue !== "string") {
    initialValue = initialValue?.value;
  }

  return {
    // Parsed JSON is the real content; cast keeps stub/null paths typing-happy
    content: content,
    readOnly: context.readOnly,
    initialValue,
    onChange: context.onValueChange,
    displayCorrectAnswers: context.displayCorrectAnswers,
    checkAnswers: context.checkAnswers,
    onAnswerChange: context.onAnswerChange,
    invisible: context.invisible,
    userId: 0,
  };
}

/**
 * Can check text answers
 * @param content - The content
 * @returns True if the content can check text answers
 */
export function canCheckTextAnswers(content: TextFieldContent): boolean {
  return content.rightAnswers?.filter((option) => option.correct).length > 0;
}

/**
 * Can check select answers
 * @param content - The content
 * @returns True if the content can check select answers
 */
export function canCheckSelectAnswers(
  content: SelectFieldContent | MultiSelectFieldContent
): boolean {
  return content.options?.filter((option) => option.correct).length > 0;
}
