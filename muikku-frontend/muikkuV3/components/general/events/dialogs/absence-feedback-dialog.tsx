import * as React from "react";
import { useState } from "react";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import { MuikkuEvent } from "~/generated/client";
import {
  createAbsenceEventProperty,
  updateAbsenceEventProperty,
} from "~/actions/main-function/guardian";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  AbsenceEventEnum,
  AbsenceReasonEnum,
  isAbsenceReasonEnum,
} from "~/reducers/base/muikku-events";
import { localize } from "~/locales/i18n";

/**
 * AbsenceFeedbackDialogProps
 */
interface AbsenceFeedbackDialogProps {
  children?: React.ReactElement;
  absenceEvent: MuikkuEvent;
  studentId: number;
  onClose?: () => void;
}

/**
 * Absence feedback dialog
 * @param props dialog props
 * @returns JSX.Element
 */
export const AbsenceFeedbackDialog: React.FC<AbsenceFeedbackDialogProps> = (
  props
) => {
  const { children, studentId, absenceEvent } = props;
  const dispatch = useDispatch();
  const currentAbsenceProperty = absenceEvent.properties.find(
    (property) => property.name === "ABSENCE_REASON"
  );
  const { t } = useTranslation();
  const initialReason = currentAbsenceProperty?.value ?? "";
  const [absenceReason, setAbsenceReason] = useState<AbsenceReasonEnum | "">(
    isAbsenceReasonEnum(initialReason) ? initialReason : ""
  );

  const hasCurrentAbsenceReason =
    currentAbsenceProperty && currentAbsenceProperty.value !== "";

  /**
   * Returns the label for the absent from
   * @returns string
   */
  const absentFromLabel = () => {
    switch (absenceEvent.title as AbsenceEventEnum) {
      case AbsenceEventEnum.Lesson:
        return t("types.LESSON", { ns: "events" });
      case AbsenceEventEnum.LessonPreArranged:
        return t("types.LESSON_PRE_ARRANGED", { ns: "events" });
      case AbsenceEventEnum.Exam:
        return t("types.EXAM", { ns: "events" });
      case AbsenceEventEnum.SkillsDemonstrationMeeting:
        return t("types.SKILLS_DEMONSTRATION_MEETING", { ns: "events" });
      case AbsenceEventEnum.GuidanceOrSupportSession:
        return t("types.GUIDANCE_OR_SUPPORT_SESSION", { ns: "events" });
    }
  };

  /**
   * Renders the content of the dialog
   * @param onClose function to handle dialog close
   * @returns JSX.Element
   */
  const content = (onClose: () => void) => (
    <form>
      <div className="form__row form__row--absence-event">
        <div className="absence-feedback__details">
          <h3 className="absence-feedback__details-title">
            {t("labels.absenceDetails", { ns: "events" })}
          </h3>
          <dl className="absence-feedback__details-list">
            <dt>{t("labels.absentFrom", { ns: "events" })}</dt>
            <dd>{absentFromLabel()}</dd>
            <dt>{t("labels.absencePeriod", { ns: "events" })}</dt>
            <dd>
              {localize.date(absenceEvent.start, "l - LT")} -{" "}
              {localize.date(absenceEvent.end, "l - LT")}
            </dd>
            {absenceEvent.description?.trim() && (
              <>
                <dt>{t("labels.makeUpInstructions", { ns: "events" })}</dt>
                <dd>{absenceEvent.description}</dd>
              </>
            )}
          </dl>
        </div>
      </div>

      <div className="form__row form__row--absence-event">
        <label htmlFor="absence-reason">
          {t("labels.selectAbsenceReason", { ns: "events" })}
        </label>
        <select
          id="absence-reason"
          className="form-element__select"
          value={absenceReason}
          onChange={(e) =>
            setAbsenceReason(e.target.value as AbsenceReasonEnum)
          }
        >
          <option value="" disabled>
            {t("labels.select", { ns: "common" })}
          </option>
          {Object.values(AbsenceReasonEnum).map((reason) => (
            <option key={reason} value={reason}>
              {t(`reasons.${reason}`, { ns: "events", defaultValue: reason })}
            </option>
          ))}
        </select>
      </div>
    </form>
  );

  /**
   * Renders the footer of the dialog
   * @param onClose function to handle dialog close
   * @returns JSX.Element
   */
  const footer = (onClose: () => void) => (
    <div className="dialog__footer">
      <div className="dialog__button-set">
        <Button
          className="button button--execute button--standard-ok"
          onClick={() => handleConfirm(onClose)}
          disabled={!absenceReason || absenceReason.trim() === ""}
        >
          {t("actions.save")}
        </Button>
        <Button
          className="button button--cancel button--standard-cancel"
          onClick={onClose}
        >
          {t("actions.cancel")}
        </Button>
      </div>
    </div>
  );

  /**
   * Handles the confirmation of the dialog
   * @param onClose dialog closing function
   */
  const handleConfirm = (onClose: () => void) => {
    if (absenceReason.trim() !== "") {
      if (hasCurrentAbsenceReason) {
        dispatch(
          updateAbsenceEventProperty(studentId, {
            eventId: absenceEvent.id,
            propertyId: currentAbsenceProperty.id,
            value: absenceReason,
          })
        );
      } else {
        dispatch(
          createAbsenceEventProperty(studentId, {
            eventId: absenceEvent.id,
            name: "ABSENCE_REASON",
            value: absenceReason,
          })
        );
      }
      onClose();
    }
  };

  return (
    <Dialog
      modifier="absence-feedback"
      title={t("labels.explainAbsence", { ns: "events" })}
      content={content}
      footer={footer}
    >
      {children}
    </Dialog>
  );
};

export default AbsenceFeedbackDialog;
