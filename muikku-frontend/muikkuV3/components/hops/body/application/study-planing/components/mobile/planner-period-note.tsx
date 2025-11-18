import * as React from "react";
import Button from "~/components/general/button";
import Dialog from "~/components/general/dialog";
import DatePicker from "react-datepicker";
import { localize } from "~/locales/i18n";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import "~/sass/elements/form.scss";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useTranslation } from "react-i18next";
import { useActivePeriod } from "../../context/active-period-context";
import BasePlannerPeriodNote, {
  BasePlannerPeriodNoteProps,
} from "../planner-period-note-base";

/**
 * MobilePlannerPeriodCourseProps
 */
interface MobilePlannerPeriodNoteProps
  extends Omit<
    BasePlannerPeriodNoteProps,
    "isDragging" | "renderSpecifyContent" | "renderDeleteWarning"
  > {}

/**
 * Mobile planner period course component
 * @param props props
 */
const MobilePlannerPeriodNote: React.FC<MobilePlannerPeriodNoteProps> = (
  props
) => {
  const { note, disabled } = props;

  const { activePeriodStartDate } = useActivePeriod();

  const { t } = useTranslation(["hops_new", "common"]);

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
    [disabled]
  );

  preview(getEmptyImage(), { captureDraggingState: true });

  return (
    <BasePlannerPeriodNote
      {...props}
      ref={drag}
      isDragging={isDragging}
      canDrag={!disabled}
      renderSpecifyContent={({
        onClose,
        onConfirm,
        onChange,
        startDate,
        isOpen,
      }) => (
        <Dialog
          isOpen={isOpen}
          onClose={onClose}
          title={t("labels.studyPlannerSpecifyNoteTitle", {
            ns: "hops_new",
          })}
          modifier="study-planner-specify-course"
          content={() => (
            <div className="study-planner__extra-section">
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
                      value={note.title}
                      //onChange={(e) => onChange(e.target.value)}
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
                      value={note.content}
                      //onChange={(e) => onChange(new Date(e.target.value))}
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
                      minDate={activePeriodStartDate}
                      selected={startDate}
                      onChange={(date) => onChange(date)}
                      locale={outputCorrectDatePickerLocale(localize.language)}
                      dateFormat="P"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          footer={() => (
            <div className="dialog__button-set">
              <Button
                buttonModifiers={["standard-ok", "execute"]}
                onClick={onConfirm}
              >
                {t("actions.save", { ns: "common" })}
              </Button>
              <Button
                buttonModifiers={["standard-cancel", "cancel"]}
                onClick={onClose}
              >
                {t("actions.cancel", { ns: "common" })}
              </Button>
            </div>
          )}
        />
      )}
      renderDeleteWarning={({ onClose, onConfirm, isOpen }) => (
        <Dialog
          isOpen={isOpen}
          onClose={onClose}
          modifier="study-planner-delete-course"
          title={t("labels.studyPlannerRemoveFromPlanTitle", {
            ns: "hops_new",
          })}
          content={(closePortal) => (
            <div>
              <span>
                {t("labels.studyPlannerRemoveNoteFromPlanDescription", {
                  ns: "hops_new",
                })}
              </span>
            </div>
          )}
          footer={() => (
            <div className="dialog__button-set">
              <Button
                buttonModifiers={["standard-ok", "fatal"]}
                onClick={onConfirm}
              >
                {t("actions.remove", { ns: "common" })}
              </Button>
              <Button
                buttonModifiers={["standard-cancel", "cancel"]}
                onClick={onClose}
              >
                {t("actions.cancel", { ns: "common" })}
              </Button>
            </div>
          )}
        />
      )}
    />
  );
};

export default MobilePlannerPeriodNote;
