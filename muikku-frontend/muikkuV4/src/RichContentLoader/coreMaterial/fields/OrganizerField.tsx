import { MathJax } from "better-react-mathjax";
import { IconGripVertical, IconX } from "@tabler/icons-react";
import { useDraggable, useDroppable, type DragEndEvent } from "@dnd-kit/react";
import { Feedback } from "@dnd-kit/dom";
import type {
  FieldComponentProps,
  OrganizerCategory,
  OrganizerFieldContent,
} from "../types";
import { DndFieldProvider } from "../dnd/DndFieldProvider";
import { useFieldSyncHandle } from "../hooks/useFieldSyncHandle";
import { useOrganizerField } from "../hooks/useOrganizerField";
import { termLabel } from "../utils/organizerField";
import { Synchronizer } from "./Synchronizer";
import classes from "./OrganizerField.module.css";

const TERM_TYPE = "organizer-term";

/**
 * Omit a data-attribute when the flag is off.
 * @param on - Whether the attribute should be present
 */
function dataFlag(on: boolean | undefined | null): true | undefined {
  return on ? true : undefined;
}

/**
 * OrganizerFieldProps
 */
interface OrganizerFieldProps extends FieldComponentProps<OrganizerFieldContent> {}

/**
 * Render term text; MathJax only when the string is math.
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
 * Draggable term in the pool. Clone feedback keeps the original in place.
 */
function OrganizerTermChip(props: {
  termId: string;
  label: string;
  fieldName: string;
  inUse: boolean;
  selected: boolean;
  readOnly?: boolean;
  onSelect: () => void;
}) {
  const { termId, label, fieldName, inUse, selected, readOnly, onSelect } =
    props;
  const type = `${TERM_TYPE}:${fieldName}`;
  const drag = useDraggable({
    id: `pool:${termId}`,
    type,
    disabled: readOnly,
    data: { kind: "pool" as const, termId },
    plugins: [Feedback.configure({ feedback: "clone" })],
  });

  return (
    <li
      ref={drag.ref}
      className={classes.term}
      data-in-use={dataFlag(inUse)}
      data-selected={dataFlag(selected)}
      data-dragging={dataFlag(drag.isDragging)}
      onClick={readOnly ? undefined : onSelect}
    >
      <span className={classes.handle} aria-hidden>
        <IconGripVertical size={16} />
      </span>
      <span className={classes.label}>
        <FieldText text={label} />
      </span>
    </li>
  );
}

/**
 * Placed term. Drag to another category to move it (not clone).
 */
function OrganizerPlacedChip(props: {
  termId: string;
  categoryId: string;
  fieldName: string;
  label: string;
  itemState?: "PASS" | "FAIL";
  readOnly?: boolean;
  onRemove: () => void;
}) {
  const {
    termId,
    categoryId,
    fieldName,
    label,
    itemState,
    readOnly,
    onRemove,
  } = props;
  const type = `${TERM_TYPE}:${fieldName}`;
  const drag = useDraggable({
    id: `placed:${categoryId}:${termId}`,
    type,
    disabled: readOnly,
    data: {
      kind: "placed" as const,
      termId,
      fromCategoryId: categoryId,
    },
  });
  return (
    <li
      ref={drag.ref}
      className={classes.placed}
      data-state={
        itemState === "PASS"
          ? "correct"
          : itemState === "FAIL"
            ? "incorrect"
            : undefined
      }
      data-dragging={dataFlag(drag.isDragging)}
      onClick={(event) => event.stopPropagation()}
    >
      <span className={classes.label}>
        <FieldText text={label} />
      </span>
      {!readOnly ? (
        <button
          type="button"
          className={classes.remove}
          aria-label="Poista"
          onClick={onRemove}
        >
          <IconX size={14} />
        </button>
      ) : null}
    </li>
  );
}

/**
 * Droppable category box.
 */
function OrganizerCategoryBox(props: {
  category: OrganizerCategory;
  fieldName: string;
  termIds: string[];
  terms: OrganizerFieldContent["terms"];
  boxState?: "PASS" | "FAIL";
  termState?: Record<string, "PASS" | "FAIL">;
  missing?: string[];
  showMissing?: boolean;
  showTermCheck?: boolean;
  readOnly?: boolean;
  onPlace: () => void;
  onRemove: (termId: string) => void;
}) {
  const {
    category,
    fieldName,
    termIds,
    terms,
    boxState,
    termState,
    missing,
    showMissing,
    showTermCheck,
    readOnly,
    onPlace,
    onRemove,
  } = props;
  const type = `${TERM_TYPE}:${fieldName}`;
  const drop = useDroppable({
    id: category.id,
    accept: type,
    disabled: readOnly,
  });

  const dataState =
    boxState === "PASS"
      ? "correct"
      : boxState === "FAIL"
        ? "incorrect"
        : undefined;

  return (
    <li
      ref={drop.ref}
      className={classes.category}
      data-drop-target={dataFlag(drop.isDropTarget)}
      data-state={dataState}
      onClick={readOnly ? undefined : onPlace}
    >
      <span className={classes.categoryTitle}>{category.name}</span>
      <ul className={classes.categoryTerms}>
        {termIds.map((termId) => {
          const itemState = showTermCheck ? termState?.[termId] : undefined;
          return (
            <OrganizerPlacedChip
              key={termId}
              termId={termId}
              categoryId={category.id}
              fieldName={fieldName}
              label={termLabel(terms, termId)}
              itemState={itemState}
              readOnly={readOnly}
              onRemove={() => onRemove(termId)}
            />
          );
        })}
        {showMissing
          ? (missing ?? []).map((termId) => (
              <li key={`missing-${termId}`} className={classes.missing}>
                <span className={classes.label}>
                  <FieldText text={termLabel(terms, termId)} />
                </span>
              </li>
            ))
          : null}
      </ul>
    </li>
  );
}

/**
 * OrganizerField — clone terms from the pool into category boxes.
 * @param props - Live field props from FieldWithLiveProps
 */
export function OrganizerField(props: OrganizerFieldProps) {
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
  const organizer = useOrganizerField({
    content,
    initialValue,
    checkAnswers,
    onAnswerChange,
    onChange,
    handle,
  });

  /**
   * Pool drop copies. Placed-chip drop moves.
   * @param event - dnd-kit drag end
   */
  function handleDragEnd(event: DragEndEvent) {
    if (event.canceled) {
      return;
    }
    const { source, target } = event.operation;
    if (!source || !target) {
      return;
    }
    const data = source.data as {
      kind?: "pool" | "placed";
      termId?: string;
      fromCategoryId?: string;
    };
    const termId = data.termId;
    const toCategoryId = String(target.id);
    if (!termId) {
      return;
    }
    if (data.kind === "placed" && data.fromCategoryId) {
      organizer.moveTerm(data.fromCategoryId, toCategoryId, termId);
      return;
    }
    organizer.addTerm(termId, toCategoryId);
  }

  if (!content) {
    return null;
  }

  if (invisible) {
    return (
      <span className={classes.wrapper} aria-hidden>
        <span className={classes.poolTitle}>{content.termTitle}</span>
        <ul className={classes.pool}>
          {organizer.order.map((termId) => (
            <li key={termId} className={classes.term} />
          ))}
        </ul>
      </span>
    );
  }

  const overallPass = organizer.check?.overall === "PASS";

  const body = (
    <span className={classes.wrapper}>
      <span className={classes.field} data-readonly={dataFlag(readOnly)}>
        <span>
          <span className={classes.poolTitle}>{content.termTitle}</span>
          <ul className={classes.pool}>
            {organizer.order.map((termId) => {
              const label = termLabel(content.terms, termId);
              if (readOnly) {
                return (
                  <li
                    key={termId}
                    className={classes.term}
                    data-in-use={dataFlag(organizer.inUse.includes(termId))}
                  >
                    <span className={classes.label}>
                      <FieldText text={label} />
                    </span>
                  </li>
                );
              }
              return (
                <OrganizerTermChip
                  key={termId}
                  termId={termId}
                  label={label}
                  fieldName={content.name}
                  inUse={organizer.inUse.includes(termId)}
                  selected={organizer.selectedTermId === termId}
                  onSelect={() => organizer.toggleSelectedTerm(termId)}
                />
              );
            })}
          </ul>
        </span>
        <ul className={classes.categories}>
          {content.categories.map((category) => {
            const box = organizer.check?.boxes[category.id];
            const showTermCheck = Boolean(
              checkAnswers && !overallPass && box && box.overall === "FAIL"
            );
            return (
              <OrganizerCategoryBox
                key={category.id}
                category={category}
                fieldName={content.name}
                termIds={organizer.boxes[category.id] ?? []}
                terms={content.terms}
                boxState={
                  displayCorrectAnswers && checkAnswers && !overallPass
                    ? box?.overall
                    : undefined
                }
                termState={box}
                missing={organizer.check?.missing[category.id]}
                showMissing={Boolean(
                  displayCorrectAnswers &&
                  checkAnswers &&
                  box?.overall === "FAIL"
                )}
                showTermCheck={showTermCheck}
                readOnly={readOnly}
                onPlace={() => organizer.placeSelectedIn(category.id)}
                onRemove={(termId) => organizer.removeTerm(category.id, termId)}
              />
            );
          })}
        </ul>
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
