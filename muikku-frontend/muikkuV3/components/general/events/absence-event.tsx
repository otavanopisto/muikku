import * as React from "react";
import { useTranslation } from "react-i18next";
import "~/sass/elements/note.scss";
import BaseEvent from "./base/base-event";
import { MuikkuEvent } from "~/generated/client";
import "~/sass/elements/muikku-absence-event.scss";
import {
  AbsenceEventEnum,
  AbsenceReasonEnum,
} from "~/reducers/base/muikku-events";
import Button from "~/components/general/button";
import PromptDialog from "~/components/general/prompt-dialog";
import EditAbsenceDialog from "~/components/workspace/workspaceUsers/dialogs/edit-absence";

/**
 * WallAbsenceEventsProps
 */
interface AbsenceEventsProps {
  modifier?: string;
  event: MuikkuEvent;
  isUnder18?: boolean;
  actions?: React.ReactElement;
  onDelete?: (eventId: number) => void;
  onUpdate?: (eventId: number, muikkuEvent: MuikkuEvent) => void;
}

/**
 * A Wall absence event component
 * @param props WallAbsenceEventPRops
 * @returns JSX.Element
 */
const AbsenceEvent: React.FC<AbsenceEventsProps> = (props) => {
  const { modifier, event, onDelete, onUpdate, isUnder18 = true } = props;
  const { t } = useTranslation("tasks");
  const absenceEventProperty = event.properties?.find(
    (prop) => prop.name === "ABSENCE_REASON"
  );
  const absenceState =
    absenceEventProperty && absenceEventProperty.value !== ""
      ? "REVIEWED"
      : isUnder18
        ? "REVIEW-PENDING"
        : "REVIEWED";

  /**
   * Returns the absent from label
   * @returns string
   */
  const absentFromLabel = () => {
    switch (event.title as AbsenceEventEnum) {
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
   * Returns the absence reason value label
   * @param value absence reason value
   * @returns string
   */
  const absenceReasonLabel = (value: string) => {
    switch (absenceEventProperty?.value as AbsenceReasonEnum) {
      case AbsenceReasonEnum.Medical:
        return t("reasons.MEDICAL_REASON", { ns: "events" });
      case AbsenceReasonEnum.OtherAuthorized:
        return t("reasons.OTHER_AUTHORIZED_REASON", { ns: "events" });
      case AbsenceReasonEnum.UnauthorizedExplained:
        return t("reasons.UNAUTHORIZED_ABSENCE_EXPLAINED", { ns: "events" });
    }
  };

  const actions =
    onUpdate && onDelete ? (
      <div className="absence-event__footer">
        <EditAbsenceDialog absenceEvent={event}>
          <Button>{t("actions.edit", { ns: "common" })}</Button>
        </EditAbsenceDialog>
        <PromptDialog
          title="Poista poissaolo"
          content={t("content.removing", {
            ns: "events",
            context: "absence",
            label: absentFromLabel(),
            userName: event.targetUserName,
          })}
          onExecute={() => onDelete(event.id!)}
        >
          <Button buttonModifiers={["danger", "standard-ok"]}>
            {t("actions.remove", { ns: "common" })}
          </Button>
        </PromptDialog>
      </div>
    ) : null;

  return (
    <BaseEvent
      beginDate={event.start}
      endDate={event.end}
      modifier={modifier}
      state={absenceState}
      title={absentFromLabel()}
    >
      <div className="muikku-absence-event">
        {event.description && (
          <div className="muikku-absence-event__prescription rich-text">
            {event.description}
          </div>
        )}
        {event.properties && (
          <div className="muikku-absence-event__body">
            {event.properties.map((prop) =>
              prop.name === "ABSENCE_REASON" ? (
                <div key={prop.id} className="muikku-absence-event__property">
                  <span className="muikku-absence-event__property-name">
                    {t("labels.property", {
                      ns: "events",
                      context: prop.name,
                    })}
                    :
                  </span>
                  <span className="muikku-absence-event__property-value">
                    {absenceReasonLabel(prop.value)}
                  </span>
                </div>
              ) : (
                <div key={prop.id} className="muikku-absence-event__property">
                  <span className="muikku-absence-event__property-name">
                    {t("labels.property", {
                      ns: "events",
                      context: prop.name,
                    })}
                    :
                  </span>
                  <span className="muikku-absence-event__property-value">
                    {prop.value}
                  </span>
                </div>
              )
            )}
          </div>
        )}

        {actions && <div className="absence-event__footer">{actions}</div>}
      </div>
    </BaseEvent>
  );
};

export default AbsenceEvent;
