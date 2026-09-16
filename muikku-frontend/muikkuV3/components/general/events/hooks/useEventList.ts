import { MuikkuEvent } from "~/generated/client";
import { useCallback, useMemo, useState } from "react";

export type EventSortBy = "start" | "end" | "title";
export type EventSortOrder = "asc" | "desc";

/**
 * UseEventListProps
 */
interface UseEventListProps {
  events: MuikkuEvent[] | undefined;
  getTitle?: (event: MuikkuEvent) => string;
  locale?: string;
}

/**
 * Returns a comparable value for the given sort key.
 * @param event event
 * @param sortBy sortBy
 * @param getTitle getTitle
 * @returns comparable sort value
 */
const getEventSortValue = (
  event: MuikkuEvent,
  sortBy: EventSortBy,
  getTitle?: (event: MuikkuEvent) => string
): string | number => {
  if (sortBy === "start" || sortBy === "end") {
    const time = new Date(String(event[sortBy] ?? "")).getTime();
    return Number.isNaN(time) ? 0 : time;
  }

  if (getTitle) {
    return getTitle(event);
  }

  return `${event.title ?? ""} ${event.containerName ?? ""}`;
};

/**
 * Compares two events by the active sort key.
 * @param a a
 * @param b b
 * @param sortBy sortBy
 * @param sortOrder sortOrder
 * @param getTitle getTitle
 * @param locale locale
 * @returns comparison result
 */
const compareEvents = (
  a: MuikkuEvent,
  b: MuikkuEvent,
  sortBy: EventSortBy,
  sortOrder: EventSortOrder,
  getTitle?: (event: MuikkuEvent) => string,
  locale?: string
): number => {
  const direction = sortOrder === "asc" ? 1 : -1;
  const aValue = getEventSortValue(a, sortBy, getTitle);
  const bValue = getEventSortValue(b, sortBy, getTitle);

  if (typeof aValue === "number" && typeof bValue === "number") {
    return direction * (aValue - bValue);
  }

  const result =
    direction *
    String(aValue).localeCompare(String(bValue), locale, {
      sensitivity: "base",
    });

  if (result !== 0) {
    return result;
  }

  const aTime = new Date(String(a.start ?? "")).getTime();
  const bTime = new Date(String(b.start ?? "")).getTime();

  return (
    direction *
    ((Number.isNaN(aTime) ? 0 : aTime) - (Number.isNaN(bTime) ? 0 : bTime))
  );
};

/**
 * Sorts events by the given key and order without mutating the original list.
 * @param events events
 * @param sortBy sortBy
 * @param sortOrder sortOrder
 * @param propertyFilter propertyFilter
 * @param getTitle getTitle
 * @param locale locale
 * @returns sorted events
 */
const sortEvents = (
  events: MuikkuEvent[] | undefined,
  sortBy: EventSortBy,
  sortOrder: EventSortOrder,
  getTitle?: (event: MuikkuEvent) => string,
  locale?: string
): MuikkuEvent[] => {
  if (!events || events.length === 0) {
    return [];
  }

  return [...events].sort((a, b) =>
    compareEvents(a, b, sortBy, sortOrder, getTitle, locale)
  );
};

/**
 * Hook for sorting a list of events by start date, end date, or title.
 * @param props props
 * @returns sorted events and sort controls
 */
export const useEventList = (props: UseEventListProps) => {
  const { events, getTitle, locale } = props;
  const [sortBy, setSortBy] = useState<EventSortBy>("start");
  const [sortOrder, setSortOrder] = useState<EventSortOrder>("asc");

  const sortedEvents = useMemo(
    () => sortEvents(events, sortBy, sortOrder, getTitle, locale),
    [events, sortBy, sortOrder, getTitle, locale]
  );

  const setSort = useCallback(
    (nextSortBy: EventSortBy, nextSortOrder: EventSortOrder) => {
      setSortBy(nextSortBy);
      setSortOrder(nextSortOrder);
    },
    []
  );

  return {
    sortedEvents,
    setSort,
    setSortBy,
    setSortOrder,
    sortBy,
    sortOrder,
  };
};
