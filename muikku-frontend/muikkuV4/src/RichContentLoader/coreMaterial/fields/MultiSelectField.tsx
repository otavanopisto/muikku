import { useEffect, useState } from "react";
import { Checkbox, Group, Stack, Tooltip } from "@mantine/core";
import { IconQuestionMark } from "@tabler/icons-react";
import { MathJax } from "better-react-mathjax";
import type { FieldComponentProps, MultiSelectFieldContent } from "../types";
import {
  checkMultiSelectAnswers,
  isCorrectMultiSelectAnswer,
  parseMultiSelectAnswer,
  toggleMultiSelectValue,
} from "../utils/selectField";
import { useFieldSyncHandle } from "../hooks/useFieldSyncHandle";
import { Synchronizer } from "./Synchronizer";
import classes from "./MultiSelectField.module.css";

/**
 * MultiSelectFieldProps
 */
interface MultiSelectFieldProps extends FieldComponentProps<MultiSelectFieldContent> {}

/**
 * Render option/explanation text; MathJax only when the string is math.
 * @param props - Plain or math text
 */
function FieldText(props: { text: string }) {
  const trimmed = props.text.trim();
  if (trimmed.startsWith("`") || trimmed.startsWith("\\(")) {
    return (
      <MathJax dynamic inline>
        {trimmed}
      </MathJax>
    );
  }
  return trimmed;
}

/**
 * MultiSelectField — checkbox group. Saved value is a sorted JSON array of option names.
 * @param props - Live field props from FieldWithLiveProps
 */
export function MultiSelectField(props: MultiSelectFieldProps) {
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

  const [values, setValues] = useState(() =>
    parseMultiSelectAnswer(initialValue)
  );
  const handle = useFieldSyncHandle();

  const optionState =
    content && checkAnswers ? checkMultiSelectAnswers(values, content) : null;
  const checkResult =
    content && checkAnswers
      ? isCorrectMultiSelectAnswer(values, content)
      : null;

  useEffect(() => {
    if (!content?.name || !checkAnswers) {
      return;
    }
    onAnswerChange?.(content.name, checkResult);
  }, [checkAnswers, checkResult, content?.name, onAnswerChange]);

  if (!content) {
    return null;
  }

  const horizontal = content.listType === "checkbox-horizontal";
  const correctOptions =
    content.options?.filter((option) => option.correct) ?? [];
  const showExamples = Boolean(displayCorrectAnswers) && checkResult !== true;

  /**
   * Toggle one option and persist the sorted name list.
   * @param optionName - Option name
   */
  function handleToggle(optionName: string) {
    if (!content) {
      return;
    }
    const next = toggleMultiSelectValue(values, optionName);
    setValues(next);
    onChange?.(handle, content.name, JSON.stringify(next));
  }

  const boxes = content.options.map((option, index) => {
    const itemState =
      optionState?.[index] === "PASS"
        ? "correct"
        : optionState?.[index] === "FAIL"
          ? "incorrect"
          : undefined;
    return (
      <span key={option.name} className={classes.item} data-state={itemState}>
        <Checkbox
          value={option.name}
          checked={values.includes(option.name)}
          disabled={readOnly}
          label={<FieldText text={option.text} />}
          onChange={() => handleToggle(option.name)}
        />
      </span>
    );
  });

  if (invisible) {
    return (
      <span className={classes.wrapper} aria-hidden>
        {boxes}
      </span>
    );
  }

  const summary =
    showExamples && (correctOptions.length > 0 || content.explanation) ? (
      <span className={classes.examples}>
        {correctOptions.length > 0
          ? correctOptions.map((option) => option.text).join(" / ")
          : content.explanation}
        {correctOptions.length > 0 && content.explanation ? (
          <Tooltip label={<FieldText text={content.explanation} />}>
            <IconQuestionMark size={14} style={{ marginLeft: 6 }} />
          </Tooltip>
        ) : null}
      </span>
    ) : null;

  return (
    <span className={classes.wrapper}>
      {horizontal ? (
        <Group gap="sm">{boxes}</Group>
      ) : (
        <Stack gap="xs">{boxes}</Stack>
      )}
      <Synchronizer
        modified={handle.state.modified}
        synced={handle.state.synced}
        syncError={handle.state.syncError}
      />
      {summary}
    </span>
  );
}
