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

  const { t } = useTranslation(["hops_new", "common"]);

  const dragRef = React.useRef<ReturnType<typeof useDrag>[1] | null>(null);

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
      canDrag: !disabled,
    }),
    [disabled, note.identifier, note.title, note.content, note.startDate]
  );

  preview(getEmptyImage(), { captureDraggingState: true });

  /**
   * handleSpecifyCourse
   * @param callback callback
   */
  const handleSpecifyClose = (callback: () => void) => {
    if (pendingSpecify) {
      callback();
      setPendingSpecify(false);
    }
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
    if (pendingDelete) {
      callback();
      setPendingDelete(false);
    }
  };

  /**
   * handleDeleteCard
   * @param callback callback
   */
  const handleDeleteCard = (callback: () => void) => {
    setPendingDelete(true);
    callback();
  };

  dragRef.current = drag;

  // Re-attach drag ref when note properties change
  const elementRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (node && dragRef.current) {
        dragRef.current(node);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [note.title, note.content, note.startDate, disabled]
  );

  return (
    <BasePlannerPeriodNote
      {...props}
      ref={elementRef}
      // This is mandatory for the drag to notice the changes when disabled has changed
      key={`${note.identifier}`}
      isDragging={isDragging}
      canDrag={!disabled}
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
          onClose={() => handleSpecifyClose(onConfirm)}
        >
          <div className="study-planner__extra-section-title">
            {t("labels.studyPlannerSpecifyPlanTitle", {
              ns: "hops_new",
            })}
          </div>

          <div className="study-planner__extra-section-content">
            <div className="study-planner__extra-section-group">
              <label className="study-planner__extra-section-group-label">
                Muistiinpanon otsikko
              </label>

              <div className="study-planner__extra-section-group-inputs">
                <input
                  type="text"
                  className="study-planner__input"
                  placeholder="Muistiinpanon otsikko"
                  value={title}
                  onChange={(e) => {
                    onChange(e.target.value, content, startDate);
                  }}
                />
              </div>
            </div>

            <div className="study-planner__extra-section-group">
              <label className="study-planner__extra-section-group-label">
                Muistiinpanon sisältö
              </label>

              <div className="study-planner__extra-section-group-inputs">
                <textarea
                  className="study-planner__input"
                  placeholder="Muistiinpanon sisältö"
                  value={content}
                  onChange={(e) => {
                    onChange(title, e.target.value, startDate);
                  }}
                />
              </div>
            </div>

            <div className="study-planner__extra-section-group">
              <label className="study-planner__extra-section-group-label">
                Muistiinpanon kuukausi
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
                {t("labels.studyPlannerRemoveFromPlanDescription", {
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
