import { MuikkuEvent } from "~/generated/client";
import { useCallback, useMemo, useState } from "react";

export type EventSortBy = "start" | "end" | "title";
export type EventSortOrder = "asc" | "desc";

/**
 * UseEventListProps
 */
interface UseEventListSortProps {
  events: MuikkuEvent[] | undefined;
  getTitle?: (event: MuikkuEvent) => string;
  locale?: string;
}

/**
 * Returns the title of the event.
 * @param event event
 * @param getTitle getTitle
 * @returns title
 */
const getEventTitle = (
  event: MuikkuEvent,
  getTitle?: (event: MuikkuEvent) => string
): string =>
  getTitle?.(event) ?? `${event.title ?? ""} ${event.containerName ?? ""}`;

/**
 * Returns the time of the event for the given key.
 * @param event event
 * @param key key
 * @returns time
 */
const getEventTime = (event: MuikkuEvent, key: "start" | "end") =>
  new Date(event[key]).getTime();

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

  if (sortBy === "title") {
    const result = getEventTitle(a, getTitle).localeCompare(
      getEventTitle(b, getTitle),
      locale,
      {
        sensitivity: "base",
      }
    );

    if (result !== 0) {
      return direction * result;
    }
  }

  const dateKey = sortBy === "start" ? "start" : "end";
  return direction * (getEventTime(a, dateKey) - getEventTime(b, dateKey));
};

/**
 * Sorts events by the given key and order without mutating the original list.
 * @param events events
 * @param sortBy sortBy
 * @param sortOrder sortOrder
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
export const useEventListSort = (props: UseEventListSortProps) => {
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
