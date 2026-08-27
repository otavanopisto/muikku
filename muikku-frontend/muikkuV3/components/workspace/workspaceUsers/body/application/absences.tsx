import * as React from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { StateType } from "~/reducers";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import AbsenceEvent from "~/components/general/events/absence-event";
import AbsencesSummary from "./absences/absences-summary";

import {
  deleteWorkspaceAbsenceEvent,
  updateWorkspaceAbsenceEvent,
} from "~/actions/workspaces";
import { MuikkuEvent } from "~/generated/client";

const Absences = () => {
  const { t } = useTranslation(["events"]);
  const dispatch = useDispatch();
  const absenceEvents = useSelector(
    (state: StateType) => state.workspaces?.currentWorkspace?.absenceEvents
  );

  if (!absenceEvents || absenceEvents.length === 0) {
    return <div className="loaded-empty">No absence events found</div>;
  }

  const handleDelete = (eventId: number) => {
    dispatch(deleteWorkspaceAbsenceEvent(eventId));
  };

  const handleUpdate = (eventId: number, muikkuEvent: MuikkuEvent) => {
    dispatch(updateWorkspaceAbsenceEvent(eventId, muikkuEvent));
  };

  return (
    <ApplicationSubPanel modifier="workspace-absences">
      <ApplicationSubPanel.Header modifier="workspace-absences">
        {t("labels.absences", { ns: "events" })}
      </ApplicationSubPanel.Header>
      <ApplicationSubPanel.Body modifier="workspace-absences-summary">
        <AbsencesSummary absences={absenceEvents} />
      </ApplicationSubPanel.Body>

      <ApplicationSubPanel.Body modifier="workspace-absences-list">
        {absenceEvents.map((absence) => (
          <AbsenceEvent
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            key={absence.id}
            event={absence}
          />
        ))}
      </ApplicationSubPanel.Body>
    </ApplicationSubPanel>
  );
};

export default Absences;
