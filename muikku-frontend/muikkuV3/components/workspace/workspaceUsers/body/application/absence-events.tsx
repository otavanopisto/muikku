import * as React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import AbsenceEvent from "~/components/general/events/event/absence-event";
import AbsencesSummary from "./absences/absences-summary";
import Button from "~/components/general/button";
import PromptDialog from "~/components/general/prompt-dialog";
import { MuikkuEvent } from "~/generated/client";
import { EditAbsenceDialog } from "~/components/workspace/workspaceUsers/dialogs/edit-absence";
import { useDispatch } from "react-redux";
import { useEventListSort } from "~/components/general/events/hooks/useEventListSort";
import { useAbsenceEventFilter } from "~/components/general/events/hooks/useAbsenceEventFilter";
import EventListSorters from "~/components/general/events/event-list-sorters";
import Link from "~/components/general/link";
import { deleteWorkspaceAbsenceEvent } from "~/actions/workspaces/index";

/**
 * Absences component
 * @returns JSX.Element
 * @param props AbsencesProps
 */
const AbsenceEvents = () => {
  const { t, i18n } = useTranslation(["events", "common"]);
  const dispatch = useDispatch();
  const absenceEvents = useSelector(
    (state: StateType) => state.workspaces?.currentWorkspace?.absenceEvents
  );
  /**
   * Returns the displayed absence title used for rendering and sorting.
   * @param absence absence
   * @returns displayed title
   */
  const getAbsenceTitle = React.useCallback(
    (absence: MuikkuEvent) =>
      absence.targetUserName +
      " - " +
      t(`types.${absence.title}`, {
        ns: "events",
        defaultValue: "UNKNOWN_TYPE",
      }),
    [t]
  );

  const { filteredEvents, eventFilters, toggleFilter } = useAbsenceEventFilter({
    events: absenceEvents,
  });

  const { sortedEvents, sortBy, sortOrder, setSort } = useEventListSort({
    events: filteredEvents,
    getTitle: getAbsenceTitle,
    locale: i18n.language,
  });

  if (!absenceEvents || absenceEvents.length === 0) {
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
  const handleDelete = (eventId: number) => {
    dispatch(deleteWorkspaceAbsenceEvent(eventId));
  };
  /**
   * Returns the actions for the absence event
   * @param absenceEvent absence event
   * @returns React.ReactNode
   */
  const actions = (absenceEvent: MuikkuEvent) => (
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
  );

  return (
    <ApplicationSubPanel modifier="workspace-absences">
      <ApplicationSubPanel.Header modifier="workspace-absences">
        {t("labels.absences", { ns: "events" })}
      </ApplicationSubPanel.Header>

      <ApplicationSubPanel.Body modifier="workspace-absences-summary">
        <AbsencesSummary absences={absenceEvents} />
      </ApplicationSubPanel.Body>

      <ApplicationSubPanel.Body modifier="workspace-absences-list">
        <div>
          <Link
            className={`link link--workspace-absences-filter ${eventFilters.includes("WITH_REASON") ? "selected" : ""}`}
            onClick={() => toggleFilter("WITH_REASON")}
          >
            {t("labels.absencesWithFeedback", { ns: "events" })}
          </Link>
          <Link
            className={`link link--workspace-absences-filter ${eventFilters.includes("WITHOUT_REASON") ? "selected" : ""}`}
            onClick={() => toggleFilter("WITHOUT_REASON")}
          >
            {t("labels.absencesWithoutFeedback", { ns: "events" })}
          </Link>
        </div>
        <EventListSorters
          modifier="workspace-absences-list"
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={setSort}
        />
        {sortedEvents.map((absence) => (
          <AbsenceEvent
            actions={actions(absence)}
            key={absence.id}
            event={absence}
          />
        ))}
      </ApplicationSubPanel.Body>
    </ApplicationSubPanel>
  );
};

export default AbsenceEvents;
