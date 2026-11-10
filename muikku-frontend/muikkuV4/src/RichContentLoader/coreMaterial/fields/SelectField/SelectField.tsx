import { useEffect, useId, useState } from "react";
import { Group, NativeSelect, Radio, Stack, Tooltip } from "@mantine/core";
import { IconQuestionMark } from "@tabler/icons-react";
import { MathJax } from "better-react-mathjax";
import type { FieldComponentProps, SelectFieldContent } from "../../types";
import { isCorrectSelectAnswer } from "../../utils/selectField";
import { useFieldSyncHandle } from "../../hooks/useFieldSyncHandle";
import { Synchronizer } from "../Synchronizer";
import classes from "./SelectField.module.css";

/**
 * SelectFieldProps
 */
interface SelectFieldProps extends FieldComponentProps<SelectFieldContent> {}

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
 * SelectField — dropdown, listbox, or radio group. Saved value is option.name.
 * @param props - Live field props from FieldWithLiveProps
 */
export function SelectField(props: SelectFieldProps) {
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
  const radioName = useId();

  const checkResult =
    content && checkAnswers ? isCorrectSelectAnswer(value, content) : null;

  useEffect(() => {
    if (!content?.name || !checkAnswers) {
      return;
    }
    onAnswerChange?.(content.name, checkResult);
  }, [checkAnswers, checkResult, content?.name, onAnswerChange]);

  if (!content) {
    return null;
  }

  const listType = content.listType ?? "dropdown";
  const isList = listType === "list";
  const isDropdown = listType === "dropdown";
  const isRadio =
    listType === "radio-horizontal" || listType === "radio-vertical";
  const dataState =
    checkResult === true
      ? "correct"
      : checkResult === false
        ? "incorrect"
        : undefined;
  const correctOptions =
    content.options?.filter((option) => option.correct) ?? [];

  /**
   * Persist the chosen option name.
   * @param next - Option name
   */
  function handleChange(next: string) {
    if (!content) {
      return;
    }
    setValue(next);
    onChange?.(handle, content.name, next);
  }

  if (invisible) {
    return (
      <span className={classes.wrapper} aria-hidden>
        {isRadio ? (
          <span>{content.options.map((option) => option.text).join(" ")}</span>
        ) : (
          <select className={classes.select} disabled />
        )}
      </span>
    );
  }

  const summary =
    displayCorrectAnswers &&
    (correctOptions.length > 0 || content.explanation) ? (
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
      {isDropdown ? (
        <NativeSelect
          className={classes.select}
          name={content.name}
          value={value}
          disabled={readOnly}
          data={[
            { value: "", label: "" },
            ...content.options.map((option) => ({
              value: option.name,
              label: option.text,
            })),
          ]}
          data-state={dataState}
          onChange={(event) => handleChange(event.currentTarget.value)}
        />
      ) : null}

      {isList ? (
        <select
          className={`${classes.select} ${classes.list}`}
          name={content.name}
          size={Math.max(content.options.length, 1)}
          value={value}
          disabled={readOnly}
          data-state={dataState}
          onChange={(event) => handleChange(event.currentTarget.value)}
        >
          {content.options.map((option) => (
            <option key={option.name} value={option.name}>
              {option.text}
            </option>
          ))}
        </select>
      ) : null}

      {isRadio ? (
        <Radio.Group
          name={radioName}
          value={value}
          onChange={handleChange}
          className={classes.radios}
          data-state={dataState}
        >
          {listType === "radio-horizontal" ? (
            <Group gap="sm">
              {content.options.map((option) => (
                <Radio
                  key={option.name}
                  value={option.name}
                  disabled={readOnly}
                  label={<FieldText text={option.text} />}
                />
              ))}
            </Group>
          ) : (
            <Stack gap="xs">
              {content.options.map((option) => (
                <Radio
                  key={option.name}
                  value={option.name}
                  disabled={readOnly}
                  label={<FieldText text={option.text} />}
                />
              ))}
            </Stack>
          )}
        </Radio.Group>
      ) : null}

      <Synchronizer
        modified={handle.state.modified}
        synced={handle.state.synced}
        syncError={handle.state.syncError}
      />
      {summary}
    </span>
  );
}
