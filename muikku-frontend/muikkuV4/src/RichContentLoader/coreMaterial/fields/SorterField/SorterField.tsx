import { MathJax } from "better-react-mathjax";
import { IconGripVertical } from "@tabler/icons-react";
import { type DragEndEvent } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import {
  RestrictToHorizontalAxis,
  RestrictToVerticalAxis,
} from "@dnd-kit/abstract/modifiers";
import type {
  FieldComponentProps,
  SorterFieldContent,
  SorterFieldItem,
} from "../../types";
import { DndFieldProvider } from "../../dnd/DndFieldProvider";
import { useSorterField } from "../../hooks/useSorterField";
import { useFieldSyncHandle } from "../../hooks/useFieldSyncHandle";
import { sorterItemLabel } from "../../utils/sorterField";
import { Synchronizer } from "../Synchronizer";
import classes from "./SorterField.module.css";

const ITEM_TYPE = "sorter-item";

/**
 * Omit a data-attribute when the flag is off.
 * @param on - Whether the attribute should be present
 */
function dataFlag(on: boolean | undefined | null): true | undefined {
  return on ? true : undefined;
}

/**
 * SorterFieldProps
 */
interface SorterFieldProps extends FieldComponentProps<SorterFieldContent> {}

/**
 * Render item text; MathJax only when the string is math.
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
 * One sorter row (no dnd hooks).
 */
function SorterItemView(props: {
  item: SorterFieldItem;
  label: string;
  state?: "PASS" | "FAIL" | null;
  isDragging?: boolean;
  readOnly?: boolean;
  innerRef?: (element: Element | null) => void;
}) {
  const { item, label, state, isDragging, innerRef } = props;
  const dataState =
    state === "PASS" ? "correct" : state === "FAIL" ? "incorrect" : undefined;

  return (
    <li
      ref={innerRef}
      className={classes.item}
      data-state={dataState}
      data-dragging={dataFlag(isDragging)}
    >
      <span className={classes.body} aria-label={item.name}>
        <span className={classes.handle} aria-hidden>
          <IconGripVertical size={16} />
        </span>
        <span className={classes.label}>
          <FieldText text={label} />
        </span>
      </span>
    </li>
  );
}

/**
 * Sortable sorter item.
 */
function SorterItem(props: {
  item: SorterFieldItem;
  index: number;
  fieldName: string;
  orientation: "vertical" | "horizontal";
  label: string;
  state?: "PASS" | "FAIL" | null;
  readOnly?: boolean;
}) {
  const { item, index, fieldName, orientation, label, state, readOnly } = props;
  const type = `${ITEM_TYPE}:${fieldName}`;
  const sortable = useSortable({
    id: item.id,
    index,
    type,
    accept: type,
    disabled: readOnly,
    modifiers: [
      orientation === "horizontal"
        ? RestrictToHorizontalAxis
        : RestrictToVerticalAxis,
    ],
  });

  return (
    <SorterItemView
      item={item}
      label={label}
      state={state}
      readOnly={readOnly}
      isDragging={sortable.isDragging}
      innerRef={sortable.ref}
    />
  );
}

/**
 * SorterField — reorder items into the authored sequence.
 * @param props - Live field props from FieldWithLiveProps
 */
export function SorterField(props: SorterFieldProps) {
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

  const handle = useFieldSyncHandle();
  const { items, answerState, checkResult, moveByIndex } = useSorterField({
    content,
    initialValue,
    checkAnswers,
    onAnswerChange,
    onChange,
    handle,
  });

  /**
   * Commit the optimistic reorder.
   * @param event - dnd-kit drag end
   */
  function handleDragEnd(event: DragEndEvent) {
    if (event.canceled) {
      return;
    }
    const { source } = event.operation;
    if (!isSortable(source)) {
      return;
    }
    const { initialIndex, index } = source;
    if (initialIndex === index) {
      return;
    }
    moveByIndex(initialIndex, index);
  }

  if (!content) {
    return null;
  }

  const orientation =
    content.orientation === "horizontal" ? "horizontal" : "vertical";
  const capitalize = Boolean(content.capitalize);
  const showExamples = Boolean(displayCorrectAnswers) && checkResult !== true;

  const list = (
    <ol className={classes.list} data-orientation={orientation}>
      {items.map((item, index) => {
        const label = sorterItemLabel(item.name, index, capitalize);
        const rowState =
          checkAnswers && checkResult !== true
            ? answerState?.[index]
            : undefined;
        if (readOnly) {
          return (
            <SorterItemView
              key={item.id}
              item={item}
              label={label}
              state={rowState}
              readOnly
            />
          );
        }
        return (
          <SorterItem
            key={item.id}
            item={item}
            index={index}
            fieldName={content.name}
            orientation={orientation}
            label={label}
            state={rowState}
            readOnly={readOnly}
          />
        );
      })}
    </ol>
  );

  if (invisible) {
    return (
      <span className={classes.wrapper} aria-hidden>
        {list}
      </span>
    );
  }

  const body = (
    <span className={classes.wrapper} data-readonly={dataFlag(readOnly)}>
      {list}
      {showExamples ? (
        <span className={classes.examples}>
          {content.items.map((item) => (
            <span key={item.id} className={classes.example}>
              <FieldText text={item.name} />
            </span>
          ))}
        </span>
      ) : null}
      <Synchronizer
        modified={handle.state.modified}
        synced={handle.state.synced}
        syncError={handle.state.syncError}
      />
    </span>
  );

  if (readOnly) {
    return body;
  }

  return <DndFieldProvider onDragEnd={handleDragEnd}>{body}</DndFieldProvider>;
}
