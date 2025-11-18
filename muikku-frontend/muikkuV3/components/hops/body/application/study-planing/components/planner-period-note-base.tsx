import moment from "moment";
import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import Link from "~/components/general/link";
import {
  StudyPlanChangeAction,
  StudyPlannerNoteWithIdentifier,
} from "~/reducers/hops";
import {
  PlannerCard,
  PlannerCardActions,
  PlannerCardContent,
  PlannerCardHeader,
} from "./planner-card";
import { useTranslation } from "react-i18next";
import { localize } from "~/locales/i18n";

// Character limit for content truncation
const CONTENT_TRUNCATE_LIMIT = 150;

/**
 * Base planner period note props
 */
export interface BasePlannerPeriodNoteProps {
  disabled: boolean;
  note: StudyPlannerNoteWithIdentifier;
  selected: boolean;
  isDragging?: boolean;
  canDrag?: boolean;
  hasChanges: boolean;
  onNoteChange: (
    note: StudyPlannerNoteWithIdentifier,
    action: StudyPlanChangeAction
  ) => void;
  onSelectNote: (note: StudyPlannerNoteWithIdentifier) => void;
  renderSpecifyContent: (props: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onChange: (title: string, content: string, startDate: Date) => void;
    title: string;
    content: string;
    startDate: Date;
  }) => React.ReactNode;
  renderDeleteWarning: (props: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }) => React.ReactNode;
}

/**
 * Specify course
 */
interface SpecifyNote {
  title: string;
  content: string;
  startDate: Date;
}

/**
 * Base planner period note component
 * @param props props
 */
const BasePlannerPeriodNote = React.forwardRef<
  HTMLDivElement,
  BasePlannerPeriodNoteProps
>((props, ref) => {
  const {
    disabled,
    note,
    selected,
    isDragging = false,
    canDrag = false,
    hasChanges,
    onNoteChange,
    onSelectNote,
    renderSpecifyContent,
    renderDeleteWarning,
  } = props;

  const [specifyIsOpen, setSpecifyIsOpen] = React.useState(false);
  const [deleteWarningIsOpen, setDeleteWarningIsOpen] = React.useState(false);
  const [isContentExpanded, setIsContentExpanded] = React.useState(false);

  const { t } = useTranslation(["hops_new", "common"]);

  const [specifyNote, setSpecifyNote] = React.useState<SpecifyNote | null>(
    null
  );

  /**
   * Checks if content should be truncated
   */
  const shouldTruncate =
    note.content && note.content.length > CONTENT_TRUNCATE_LIMIT;

  /**
   * Gets truncated content
   */
  const getTruncatedContent = () => {
    if (!note.content) return "";
    if (!shouldTruncate) return note.content;
    return (
      <>
        {isContentExpanded
          ? note.content
          : note.content.substring(0, CONTENT_TRUNCATE_LIMIT) + "..."}
        <Link
          onClick={handleToggleContent}
          className="link link--study-planner-content-toggle"
        >
          {isContentExpanded
            ? t("actions.showLess", {
                ns: "common",
              })
            : t("actions.showMore", {
                ns: "common",
              })}
        </Link>
      </>
    );
  };

  /**
   * Handles expand/collapse toggle
   * @param e event
   */
  const handleToggleContent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsContentExpanded(!isContentExpanded);
  };

  /**
   * Handles specify open
   * @param e event
   */
  const handleSpecifyOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    unstable_batchedUpdates(() => {
      setSpecifyIsOpen(true);
      setSpecifyNote(() => {
        const startDate = new Date(note.startDate);
        return {
          title: note.title,
          content: note.content,
          startDate,
        };
      });
      setDeleteWarningIsOpen(false);
    });
  };

  /**
   * Handles delete open
   * @param e event
   */
  const handleDeleteOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    unstable_batchedUpdates(() => {
      setSpecifyIsOpen(false);
      setDeleteWarningIsOpen(true);
    });
  };

  /**
   * Handles specify change
   * @param title title
   * @param content content
   * @param startDate start date
   */
  const handleSpecifyChange = (
    title: string,
    content: string,
    startDate: Date
  ) => {
    setSpecifyNote({ title, content, startDate });
  };

  /**
   * Handles confirm specify
   */
  const handleConfirmSpecify = () => {
    const startDate = moment(specifyNote.startDate).format("YYYY-MM-DD");

    onNoteChange(
      {
        ...note,
        title: specifyNote.title,
        content: specifyNote.content,
        startDate,
      },
      "update"
    );
    setSpecifyIsOpen(false);
  };

  /**
   * Handles confirm delete
   */
  const handleConfirmDelete = () => {
    onNoteChange(note, "delete");
    setDeleteWarningIsOpen(false);
  };

  /**
   * Handles select course
   * @param e event
   */
  const handleSelectCourse = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (disabled || specifyIsOpen || deleteWarningIsOpen) {
      return;
    }

    onSelectNote(note);
  };

  const cardModifiers = ["note"];
  isDragging && cardModifiers.push("is-dragging");
  canDrag
    ? cardModifiers.push("draggable")
    : cardModifiers.push("not-draggable");
  selected && cardModifiers.push("selected");

  return (
    <PlannerCard
      ref={ref}
      modifiers={[...cardModifiers]}
      onClick={handleSelectCourse}
      externalContent={
        <>
          {renderSpecifyContent({
            isOpen: specifyIsOpen,
            // eslint-disable-next-line jsdoc/require-jsdoc
            onClose: () => setSpecifyIsOpen(false),
            onConfirm: handleConfirmSpecify,
            onChange: handleSpecifyChange,
            title: specifyNote && specifyNote.title,
            content: specifyNote && specifyNote.content,
            startDate: specifyNote && specifyNote.startDate,
          })}

          {renderDeleteWarning({
            isOpen: deleteWarningIsOpen,
            // eslint-disable-next-line jsdoc/require-jsdoc
            onClose: () => setDeleteWarningIsOpen(false),
            onConfirm: handleConfirmDelete,
          })}
        </>
      }
    >
      <PlannerCardHeader>
        <span className="study-planner__note-title">
          <b>{`${note.title}`}</b>{" "}
          {hasChanges && <span className="study-planner__note-unsaved">*</span>}
        </span>
      </PlannerCardHeader>

      <PlannerCardContent>
        {getTruncatedContent()}
        <div className="study-planner__note-dates">
          {localize.date(new Date(note.startDate))}
        </div>
      </PlannerCardContent>

      {!disabled && (
        <PlannerCardActions>
          <Link
            onClick={handleSpecifyOpen}
            disabled={specifyIsOpen || deleteWarningIsOpen}
            className="link link--study-planner-specify"
          >
            {t("actions.specify", {
              ns: "common",
            })}
          </Link>
          <Link
            onClick={handleDeleteOpen}
            disabled={specifyIsOpen || deleteWarningIsOpen}
            className="link link--study-planner-delete"
          >
            {t("actions.remove", {
              ns: "common",
            })}
          </Link>
        </PlannerCardActions>
      )}
    </PlannerCard>
  );
});

BasePlannerPeriodNote.displayName = "BasePlannerPeriodNote";

export default BasePlannerPeriodNote;
