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
  const absenceEvents = useSelector(
    (state: StateType) => state.guider?.currentStudent?.absenceEvents
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

  return (
    <ApplicationSubPanel modifier="guider-absences">
      <ApplicationSubPanel.Header modifier="guider-absences">
        <span>{t("labels.absences", { ns: "events" })}</span>
        <EventListSorters
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={setSort}
        />
      </ApplicationSubPanel.Header>
      <ApplicationSubPanel.Body modifier="guider-absences-list">
        <ApplicationSubPanel.Body.Aside>
          <NavigationAside
            setEventFilter={toggleFilter}
            activeFilters={eventFilters}
          />
        </ApplicationSubPanel.Body.Aside>
        <ApplicationSubPanel.Body.Content>
          {sortedEvents.map((absence) => (
            <AbsenceEvent
              key={absence.id}
              title={getAbsenceTitle(absence)}
              event={absence}
            />
          ))}
        </ApplicationSubPanel.Body.Content>
      </ApplicationSubPanel.Body>
    </ApplicationSubPanel>
  );
};

export default Absences;
