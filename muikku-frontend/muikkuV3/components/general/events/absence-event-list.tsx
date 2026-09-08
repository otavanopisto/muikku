import * as React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import AbsenceEvent from "~/components/general/events/event/absence-event";

/* import Button from "~/components/general/button";
import PromptDialog from "~/components/general/prompt-dialog";
import { MuikkuEvent } from "~/generated/client";
import { EditAbsenceDialog } from "~/components/workspace/workspaceUsers/dialogs/edit-absence"; */
import { useDispatch } from "react-redux";
import { MuikkuEvent } from "~/generated/client";
/**
 * AbsencesProps
 */
interface AbsenceEventListProps {
  eventActions?: (event: MuikkuEvent) => React.ReactNode;
  events: MuikkuEvent[];
}

/**
 * Absences component
 * @returns JSX.Element
 * @param props AbsencesProps
 */
const AbsenceEventList = (props: AbsenceEventListProps) => {
  const { t } = useTranslation(["events", "common"]);
  const { events, eventActions } = props;

  if (!events || events.length === 0) {
    return (
      <div className="loaded-empty">
        {t("content.empty", { ns: "events", context: "absence" })}
      </div>
    );
  }

  /**
   * Handles the deletion of the absence event
   * @param eventId eventId
   */
  /*   const handleDelete = (eventId: number) => {
    dispatch(onDelete(eventId));
  }; */
  /**
   * Returns the actions for the absence event
   * @param absenceEvent absence event
   * @returns React.ReactNode
   */
  /*   const actions = (absenceEvent: MuikkuEvent) => (
    <div className="muikku-absence-event__footer">
      <EditAbsenceDialog absenceEvent={absenceEvent}>
        <Button buttonModifiers={["info"]}>
          {t("actions.edit", { ns: "common" })}
        </Button>
      </EditAbsenceDialog>
      <PromptDialog
        title={t("labels.remove", {
          ns: "events",
          context: "absence",
        })}
        content={t("content.removing", {
          ns: "events",
          context: "absence",
          label: t(`types.${absenceEvent.title}`, {
            ns: "events",
            defaultValue: "UNKNOWN_TYPE",
          }),
          userName: absenceEvent.targetUserName,
        })}
        onExecute={() => handleDelete(absenceEvent.id!)}
      >
        <Button buttonModifiers={["fatal", "standard-ok"]}>
          {t("actions.remove", { ns: "common" })}
        </Button>
      </PromptDialog>
    </div>
  ); */

  return (
    <ApplicationSubPanel modifier="workspace-absences">
      <ApplicationSubPanel.Header modifier="workspace-absences">
        {t("labels.absences", { ns: "events" })}
      </ApplicationSubPanel.Header>
      {/*       <ApplicationSubPanel.Body modifier="workspace-absences-summary">
        <AbsencesSummary absences={absenceEvents} />
      </ApplicationSubPanel.Body> */}

      <ApplicationSubPanel.Body modifier="workspace-absences-list">
        {events.map((event) => (
          <AbsenceEvent
            actions={eventActions ? eventActions(event) : undefined}
            key={event.id}
            event={event}
          />
        ))}
      </ApplicationSubPanel.Body>
    </ApplicationSubPanel>
  );
};

export default AbsenceEventList;
