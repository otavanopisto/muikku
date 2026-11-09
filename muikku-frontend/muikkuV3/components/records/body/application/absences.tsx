import * as React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import AbsenceEvent from "~/components/general/events/event/absence-event";
import EventListSorters from "~/components/general/events/event-list-sorters";
import { useEventListSort } from "~/components/general/events/hooks/useEventListSort";
import { useAbsenceEventFilter } from "~/components/general/events/hooks/useAbsenceEventFilter";
import { MuikkuEvent } from "~/generated/client";
import NavigationAside from "./absences/aside";
import useIsAtBreakpoint from "~/hooks/useIsAtBreakpoint";
import { breakpoints } from "~/util/breakpoints";
import Button from "~/components/general/button";
import AbsenceFeedbackDialog from "~/components/general/events/dialogs/absence-feedback-dialog";
import {
  createAbsenceEventProperty,
  updateAbsenceEventProperty,
} from "~/actions/base/muikku-events";

/**
 * AbsencesProps
 */
interface AbsencesProps {}

/**
 * Absences component
 * @returns JSX.Element
 * @param props AbsencesProps
 */
const Absences = (props: AbsencesProps) => {
  const { t, i18n } = useTranslation(["events", "common"]);
  const isMobileWidth = useIsAtBreakpoint(breakpoints.breakpointPad);
  const status = useSelector((state: StateType) => state.status);
  const absenceEvents = useSelector(
    (state: StateType) => state.muikkuEvents.absenceEvents
  );

  /**
   * Returns the displayed absence title used for rendering and sorting.
   * @param absence absence
   * @returns displayed title
   */
  const getAbsenceTitle = React.useCallback(
    (absence: MuikkuEvent) =>
      t(`types.${absence.title}`, {
        ns: "events",
        defaultValue: "UNKNOWN_TYPE",
      }) + (absence.containerName ? " - " + absence.containerName : ""),
    [t]
  );

  /**
   * Returns the feedback actions for the absence event.
   * @param event event
   * @returns React.ReactNode
   */
  const getAbsenceActions = (event: MuikkuEvent) => {
    if (status.isUnder18) {
      return undefined;
    }

    const hasFeedback = event.properties?.find(
      (property) => property.name === "ABSENCE_REASON" && property.value !== ""
    );

    return (
      <AbsenceFeedbackDialog
        absenceEvent={event}
        onUpdate={updateAbsenceEventProperty}
        onCreate={createAbsenceEventProperty}
      >
        <Button className="button button--primary-function-content">
          {hasFeedback
            ? t("actions.editFeedback", { ns: "events" })
            : t("actions.giveFeedback", { ns: "events" })}
        </Button>
      </AbsenceFeedbackDialog>
    );
  };

  const { filteredEvents, eventFilters, toggleFilter } = useAbsenceEventFilter({
    events: absenceEvents.events,
  });

  const { sortedEvents, sortBy, sortOrder, setSort } = useEventListSort({
    events: filteredEvents,
    getTitle: getAbsenceTitle,
    locale: i18n.language,
  });

  if (absenceEvents.state !== "READY") {
    return null;
  }

  if (absenceEvents.events.length === 0) {
    return (
      <div className="loaded-empty">
        {t("content.empty", { ns: "events", context: "absence" })}
      </div>
    );
  }

  return (
    <ApplicationSubPanel modifier="studies-absences">
      <ApplicationSubPanel.Header modifier="studies-absences">
        <span>{t("labels.absences", { ns: "events" })}</span>
        <EventListSorters
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={setSort}
        />
      </ApplicationSubPanel.Header>
      <ApplicationSubPanel.Body modifier="studies-absences-list">
        {!isMobileWidth && (
          <ApplicationSubPanel.Body.Aside>
            <NavigationAside
              setEventFilter={toggleFilter}
              activeFilters={eventFilters}
            />
          </ApplicationSubPanel.Body.Aside>
        )}
        <ApplicationSubPanel.Body.Content>
          {sortedEvents.map((absence) => (
            <AbsenceEvent
              key={absence.id}
              title={getAbsenceTitle(absence)}
              event={absence}
              actions={getAbsenceActions(absence)}
            />
          ))}
        </ApplicationSubPanel.Body.Content>
      </ApplicationSubPanel.Body>
    </ApplicationSubPanel>
  );
};

export default Absences;
