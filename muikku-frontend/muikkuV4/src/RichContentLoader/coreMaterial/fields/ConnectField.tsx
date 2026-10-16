import { MathJax } from "better-react-mathjax";
import { IconGripVertical } from "@tabler/icons-react";
import { type DragEndEvent } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import type {
  ConnectFieldContent,
  ConnectFieldItem,
  FieldComponentProps,
} from "../types";
import { DndFieldProvider } from "../dnd/DndFieldProvider";
import { useConnectField } from "../hooks/useConnectField";
import { useFieldSyncHandle } from "../hooks/useFieldSyncHandle";
import { correctTermNumber } from "../utils/connectField";
import { Synchronizer } from "./Synchronizer";
import classes from "./ConnectField.module.css";

const COUNTERPART_TYPE = "connect-counterpart";

/**
 * Omit a data-attribute when the flag is off.
 * @param on - Whether the attribute should be present
 */
function dataFlag(on: boolean | undefined | null): true | undefined {
  return on ? true : undefined;
}

/**
 * ConnectFieldProps
 */
interface ConnectFieldProps extends FieldComponentProps<ConnectFieldContent> {}

/**
 * Render term/counterpart text; MathJax only when the string is math.
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
 * Term or counterpart row chrome (no dnd hooks).
 */
function ConnectItemView(props: {
  item: ConnectFieldItem;
  index: number;
  kind: "term" | "counterpart";
  state?: "PASS" | "FAIL" | null;
  correctNumber?: number | null;
  isDragging?: boolean;
  isDropTarget?: boolean;
  readOnly?: boolean;
  innerRef?: (element: Element | null) => void;
}) {
  const {
    item,
    index,
    kind,
    state,
    correctNumber,
    isDragging,
    isDropTarget,
    readOnly,
    innerRef,
  } = props;

  const dataState =
    state === "PASS" ? "correct" : state === "FAIL" ? "incorrect" : undefined;

  return (
    <li
      ref={innerRef}
      className={`${classes.item} ${
        kind === "term" ? classes.term : classes.counterpart
      }`}
      data-state={dataState}
      data-dragging={dataFlag(isDragging)}
      data-drop-target={dataFlag(isDropTarget)}
    >
      <span
        className={classes.body}
        tabIndex={kind === "counterpart" && !readOnly ? 0 : undefined}
        aria-label={item.text}
      >
        {kind === "term" ? (
          <span className={classes.number}>{index + 1}</span>
        ) : (
          <span className={classes.handle} aria-hidden>
            <IconGripVertical size={16} />
          </span>
        )}
        <span className={classes.label}>
          <FieldText text={item.text} />
        </span>
        {kind === "counterpart" && correctNumber != null ? (
          <span className={classes.correctNumber}>{correctNumber}</span>
        ) : null}
      </span>
    </li>
  );
}

/**
 * Sortable counterpart. Optimistic sorting previews the insertion gap.
 */
function ConnectCounterpart(props: {
  item: ConnectFieldItem;
  index: number;
  fieldName: string;
  state?: "PASS" | "FAIL" | null;
  correctNumber?: number | null;
  readOnly?: boolean;
}) {
  const { item, index, fieldName, readOnly, ...view } = props;
  const type = `${COUNTERPART_TYPE}:${fieldName}`;
  const sortable = useSortable({
    id: item.name,
    index,
    type,
    accept: type,
    disabled: readOnly,
  });
  return (
    <ConnectItemView
      {...view}
      item={item}
      index={index}
      kind="counterpart"
      readOnly={readOnly}
      isDragging={sortable.isDragging}
      isDropTarget={sortable.isDropTarget}
      innerRef={sortable.ref}
    />
  );
}

/**
 * ConnectField — pairing by row index. Counterparts swap on drop.
 * @param props - Live field props from FieldWithLiveProps
 */
export function ConnectField(props: ConnectFieldProps) {
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
  const { fields, counterparts, answerState, checkResult, moveByIndex } =
    useConnectField({
      content,
      initialValue,
      checkAnswers,
      onAnswerChange,
      onChange,
      handle,
    });

  /**
   * Commit the optimistic reorder. Indexes come from the sortable source.
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

  if (invisible) {
    return (
      <span className={classes.wrapper} aria-hidden>
        <span className={classes.field}>
          <ol className={classes.list}>
            {fields.map((field) => (
              <li
                key={field.name}
                className={`${classes.item} ${classes.term}`}
              />
            ))}
          </ol>
        </span>
      </span>
    );
  }

  const body = (
    <span className={classes.wrapper}>
      <span
        className={classes.field}
        data-readonly={dataFlag(readOnly)}
        data-check={dataFlag(checkResult === true) ? "correct" : "incorrect"}
      >
        <ol className={classes.list}>
          {fields.map((field, index) => (
            <ConnectItemView
              key={field.name}
              item={field}
              index={index}
              kind="term"
              state={answerState?.[index]}
              readOnly={readOnly}
            />
          ))}
        </ol>
        <ol className={classes.list}>
          {counterparts.map((item, index) => {
            const rowState = answerState?.[index];
            const showNumber =
              displayCorrectAnswers && rowState !== "PASS"
                ? correctTermNumber(item.name, fields, content)
                : null;

            if (readOnly) {
              return (
                <ConnectItemView
                  key={item.name}
                  item={item}
                  index={index}
                  kind="counterpart"
                  state={rowState}
                  correctNumber={showNumber}
                  readOnly
                />
              );
            }

            return (
              <ConnectCounterpart
                key={item.name}
                item={item}
                index={index}
                fieldName={content.name}
                state={rowState}
                correctNumber={showNumber}
              />
            );
          })}
        </ol>
      </span>
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
