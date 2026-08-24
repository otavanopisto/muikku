// workspace users absences application component
// has a list of absences
// absence has an icon to delete an absence
// absence shows absence type, start date, end date and if absence has properties or not
// animateheight component is used to show absence details
// absences are paginated
// absences are sorted by start date
// absences are sorted by end date
// absences are sorted by absence type
// absences are sorted by absence properties (if any)

import * as React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import AbsenceEvent from "~/components/general/events/absence-event";

const Absences = () => {
  const { t } = useTranslation(["events"]);
  const absenceEvents = useSelector(
    (state: StateType) => state.workspaces?.currentWorkspace?.absenceEvents
  );

  if (!absenceEvents || absenceEvents.length === 0) {
    return <div className="loaded-empty">No absence events found</div>;
  }

  return (
    <ApplicationSubPanel modifier="workspace-absences">
      <ApplicationSubPanel.Header modifier="workspace-absences">
        {t("labels.absences", { ns: "events" })}
      </ApplicationSubPanel.Header>
      <ApplicationSubPanel.Body modifier="workspace-absences">
        {absenceEvents.map((absence) => (
          <AbsenceEvent key={absence.id} event={absence} />
        ))}
      </ApplicationSubPanel.Body>
    </ApplicationSubPanel>
  );
};

export default Absences;
