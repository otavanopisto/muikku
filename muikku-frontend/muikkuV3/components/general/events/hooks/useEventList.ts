// A hook with sorting functions for event
// Sort by start date toggled by a button
// Sort by end date toggled by a button
// Sort by type toggled by a button

import { MuikkuEvent } from "~/generated/client";
import { useState, useMemo } from "react";

type SortBy = "start" | "end" | "type";
type SortOrder = "asc" | "desc";

/**
 * UseEventListProps
 */
interface UseEventListProps {
  events: MuikkuEvent[];
}

/**
 * Compares two events by the active sort key.
 * @param a a
 * @param b b
 * @param sortBy sortBy
 * @param sortOrder sortOrder
 * @returns comparison result
 */
const compareEvents = (
  a: MuikkuEvent,
  b: MuikkuEvent,
  sortBy: SortBy,
  sortOrder: SortOrder
): number => {
  const direction = sortOrder === "asc" ? 1 : -1;

  if (sortBy === "start" || sortBy === "end") {
    const aTime = new Date(String(a[sortBy] ?? "")).getTime();
    const bTime = new Date(String(b[sortBy] ?? "")).getTime();
    const aValue = Number.isNaN(aTime) ? 0 : aTime;
    const bValue = Number.isNaN(bTime) ? 0 : bTime;

    return direction * (aValue - bValue);
  }

  return (
    direction *
    String(a[sortBy] ?? "").localeCompare(String(b[sortBy] ?? ""), undefined, {
      sensitivity: "base",
    })
  );
};

/**
 * Sorts events by the given key and order without mutating the original list.
 * @param events events
 * @param sortBy sortBy
 * @param sortOrder sortOrder
 * @returns sorted events
 */
const sortEvents = (
  events: MuikkuEvent[],
  sortBy: SortBy,
  sortOrder: SortOrder
): MuikkuEvent[] =>
  [...events].sort((a, b) => compareEvents(a, b, sortBy, sortOrder));

/**
 * Hook for sorting a list of events by start date, end date, or type.
 * @param props props
 * @returns sorted events and sort controls
 */
export const useEventList = (props: UseEventListProps) => {
  const { events } = props;
  const [sortBy, setSortBy] = useState<SortBy>("start");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const sortedEvents = useMemo(
    () => sortEvents(events, sortBy, sortOrder),
    [events, sortBy, sortOrder]
  );

  return { sortedEvents, setSortBy, setSortOrder, sortBy, sortOrder };
};
