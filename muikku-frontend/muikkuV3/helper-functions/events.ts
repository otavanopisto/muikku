import { MuikkuEvents } from "~/reducers/base/muikku-events";

/**
 * Filter absence events that have no reason (properties are empty)
 * @param absenceEvents - The absence events to filter
 * @returns The filtered events
 */
export const filterAbsenceEventsWithoutReason = (absenceEvents: MuikkuEvents) =>
  absenceEvents.events.filter(
    (event) => event.type === "ABSENCE" && event.properties.length === 0
  );
