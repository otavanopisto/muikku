import { MuikkuEvent } from "~/generated/client";
import { useCallback, useMemo, useState } from "react";

export type AbsenceEventFilter = "WITH_REASON" | "WITHOUT_REASON";

/**
 * UseAbsenceEventFilterProps
 */
interface UseAbsenceEventFilterProps {
  events: MuikkuEvent[] | undefined;
}

/**
 * Checks whether an event has an absence reason property.
 * @param event event
 * @returns true if the event has an absence reason
 */
const hasAbsenceReason = (event: MuikkuEvent): boolean =>
  event.properties?.some((property) => property.name === "ABSENCE_REASON") ??
  false;

/**
 * Filters events by absence reason. No filter or both filters returns all events.
 * @param events events
 * @param eventFilters eventFilters
 * @returns filtered events
 */
const filterAbsenceEvents = (
  events: MuikkuEvent[] | undefined,
  eventFilters: AbsenceEventFilter[]
): MuikkuEvent[] => {
  if (!events) {
    return [];
  }

  const withReason = eventFilters.includes("WITH_REASON");
  const withoutReason = eventFilters.includes("WITHOUT_REASON");

  if (withReason === withoutReason) {
    return events;
  }

  return events.filter((event) => hasAbsenceReason(event) === withReason);
};

/**
 * Hook for filtering absence events by whether they have a reason.
 * @param props props
 * @returns filtered events and filter controls
 */
export const useAbsenceEventFilter = (props: UseAbsenceEventFilterProps) => {
  const { events } = props;
  const [eventFilters, setEventFilters] = useState<AbsenceEventFilter[]>([]);

  const filteredEvents = useMemo(
    () => filterAbsenceEvents(events, eventFilters),
    [events, eventFilters]
  );

  /**
   * Toggles a filter.
   * @param filter filter
   */
  const toggleFilter = useCallback((filter: AbsenceEventFilter) => {
    setEventFilters((currentFilters) =>
      currentFilters.includes(filter)
        ? currentFilters.filter((currentFilter) => currentFilter !== filter)
        : [...currentFilters, filter]
    );
  }, []);

  return {
    filteredEvents,
    eventFilters,
    toggleFilter,
  };
};
