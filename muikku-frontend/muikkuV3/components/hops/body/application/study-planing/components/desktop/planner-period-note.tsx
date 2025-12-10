import * as React from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import Button from "~/components/general/button";
import { AnimatedDrawer } from "../Animated-drawer";
import DatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import BasePlannerPeriodNote, {
  BasePlannerPeriodNoteProps,
} from "../planner-period-note-base";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import { useActivePeriod } from "../../context/active-period-context";
import { localize } from "~/locales/i18n";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";

/**
 * DesktopPlannerPeriodCourseProps
 */
interface DesktopPlannerPeriodNoteProps
  extends Omit<
    BasePlannerPeriodNoteProps,
    "renderSpecifyContent" | "renderDeleteWarning"
  > {}

/**
 * Desktop planner period note component
 * @param props props
 */
const DesktopPlannerPeriodNote: React.FC<DesktopPlannerPeriodNoteProps> = (
  props
) => {
  const { note, disabled } = props;

  const { activePeriodStartDate } = useActivePeriod();

  const [pendingDelete, setPendingDelete] = React.useState(false);
  const [pendingSpecify, setPendingSpecify] = React.useState(false);

  const [isBeingEdited, setIsBeingEdited] = React.useState(false);

  const { t } = useTranslation(["hops_new", "common"]);

  //const dragRef = React.useRef<ReturnType<typeof useDrag>[1] | null>(null);

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: "note-card",
      item: {
        info: note,
        type: "note-card",
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      options: {
        dropEffect: "move",
      },
      canDrag: !disabled && !isBeingEdited,
    }),
    [disabled, isBeingEdited]
  );

  preview(getEmptyImage(), { captureDraggingState: true });

  // Use a callback ref that conditionally attaches the drag ref
  const dragRefCallback = React.useCallback(
    (node: HTMLDivElement | null) => {
      const canDrag = !disabled && !isBeingEdited;
      if (node && canDrag) {
        drag(node);
      } else if (!canDrag) {
        // Detach when dragging should be disabled
        drag(null);
      }
    },
    [disabled, isBeingEdited, drag]
  );

  /**
   * handleSpecifyCourse
   * @param callback callback
   */
  const handleSpecifyClose = (callback: () => void) => {
    unstable_batchedUpdates(() => {
      if (pendingSpecify) {
        callback();
        setPendingSpecify(false);
      }

      setIsBeingEdited(false);
    });
  };

  /**
   * handleSpecifyCourse
   * @param callback callback
   */
  const handleSpecifyNote = (callback: () => void) => {
    setPendingSpecify(true);
    callback();
  };

  /**
   * handleTransitionEnd
   * @param callback callback
   */
  const handleClose = (callback: () => void) => {
    unstable_batchedUpdates(() => {
      if (pendingDelete) {
        callback();
        setPendingDelete(false);
      }

      setIsBeingEdited(false);
    });
  };

  /**
   * handleDeleteCard
   * @param callback callback
   */
  const handleDeleteCard = (callback: () => void) => {
    setPendingDelete(true);
    callback();
  };

  return (
    <BasePlannerPeriodNote
      {...props}
      ref={dragRefCallback}
      key={`draggable-note-${note.identifier}`}
      isDragging={isDragging}
      canDrag={!disabled && !isBeingEdited}
      renderSpecifyContent={({
        onClose,
        onConfirm,
        onChange,
        title,
        content,
        startDate,
        isOpen,
      }) => (
        <AnimatedDrawer
          isOpen={isOpen}
          contentClassName="study-planner__extra-section"
          onOpen={() => setIsBeingEdited(true)}
          onClose={() => handleSpecifyClose(onConfirm)}
        >
          <div className="study-planner__extra-section-title">
            {t("labels.studyPlannerSpecifyNoteTitle", {
              ns: "hops_new",
            })}
          </div>

          <div className="study-planner__extra-section-content">
            <div className="study-planner__extra-section-group">
              <label className="study-planner__extra-section-group-label">
                {t("labels.title", {
                  ns: "common",
                })}
              </label>

              <div className="study-planner__extra-section-group-inputs">
                <input
                  type="text"
                  className="study-planner__input"
                  value={title}
                  onChange={(e) => {
                    onChange(e.target.value, content, startDate);
                  }}
                />
              </div>
            </div>

            <div className="study-planner__extra-section-group">
              <label className="study-planner__extra-section-group-label">
                {t("labels.content", {
                  ns: "common",
                })}
              </label>

              <div className="study-planner__extra-section-group-inputs">
                <textarea
                  className="study-planner__textarea"
                  value={content}
                  onChange={(e) => {
                    onChange(title, e.target.value, startDate);
                  }}
                />
              </div>
            </div>

            <div className="study-planner__extra-section-group">
              <label className="study-planner__extra-section-group-label">
                {t("labels.date", {
                  ns: "common",
                })}
              </label>

              <div className="study-planner__extra-section-date-inputs">
                <DatePicker
                  className="study-planner__input"
                  placeholderText={t("labels.startDate", {
                    ns: "hops_new",
                  })}
                  selected={startDate}
                  minDate={activePeriodStartDate}
                  onChange={(date, e) => {
                    onChange(title, content, date);
                  }}
                  locale={outputCorrectDatePickerLocale(localize.language)}
                  dateFormat="P"
                />
              </div>
            </div>

            <div className="study-planner__extra-section-group study-planner__extra-section-group--button-set">
              <Button
                buttonModifiers={["standard-ok", "execute"]}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpecifyNote(onClose);
                }}
              >
                {t("actions.save", {
                  ns: "common",
                })}
              </Button>
              <Button
                buttonModifiers={["standard-cancel", "cancel"]}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                {t("actions.cancel", {
                  ns: "common",
                })}
              </Button>
            </div>
          </div>
        </AnimatedDrawer>
      )}
      renderDeleteWarning={({ isOpen, onClose, onConfirm }) => (
        <AnimatedDrawer
          isOpen={isOpen}
          contentClassName="study-planner__extra-section"
          onOpen={() => setIsBeingEdited(true)}
          onClose={() => handleClose(onConfirm)}
        >
          <div className="study-planner__extra-section-title">
            {t("labels.studyPlannerRemoveFromPlanTitle", {
              ns: "hops_new",
            })}
          </div>
          <div className="study-planner__extra-section-content">
            <div className="study-planner__extra-section-group">
              <span className="study-planner__extra-section-group-label-info">
                {t("labels.studyPlannerRemoveNoteFromPlanDescription", {
                  ns: "hops_new",
                })}
              </span>
            </div>

            <div className="study-planner__extra-section-group study-planner__extra-section-group--button-set">
              <Button
                buttonModifiers={["standard-ok", "fatal"]}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCard(onClose);
                }}
              >
                {t("actions.remove", {
                  ns: "common",
                })}
              </Button>
              <Button
                buttonModifiers={["standard-cancel", "cancel"]}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                {t("actions.cancel", {
                  ns: "common",
                })}
              </Button>
            </div>
          </div>
        </AnimatedDrawer>
      )}
    />
  );
};

export default DesktopPlannerPeriodNote;
