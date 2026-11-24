import type {
  DatedActivityLogEntry,
  DatedActivityLogHash,
} from "~/src/atoms/activitylogs";
import { userActivityLogsDataAtom } from "~/src/atoms/activitylogs";
import { useAtomValue } from "jotai";
import { ActivityLogType } from "~/generated/client";
import { localize } from "~/src/locales/i18n";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";

export type TimelineEvent = {
  title: string;
  subtitle?: string;
  type: ActivityLogType;
  timestamp: Date;
  alternate: boolean;
  opposite: string;
};

const byNewest = (a: DatedActivityLogEntry, b: DatedActivityLogEntry) =>
  b.timestamp.getTime() - a.timestamp.getTime();

const dayKey = (timestamp: Date) =>
  localize.getLocalizedDayjs(timestamp).format("YYYY-MM-DD");

const toEvent = (
  entry: DatedActivityLogEntry,
  alternate: boolean,
  title: string,
  opposite: string,
  subtitle?: string
): TimelineEvent => ({
  title,
  subtitle,
  type: entry.type,
  timestamp: entry.timestamp,
  alternate,
  opposite,
});

const getTimelineTimeFormat = (timestamp: Date) => {
  const isToday = (timestamp: Date) =>
    localize
      .getLocalizedDayjs(timestamp)
      .isSame(localize.getLocalizedDayjs(), "day");

  return isToday(timestamp) ? "HH:mm" : "DD.MM.YYYY HH:mm";
};

const filterActivityLogs = (
  logs: DatedActivityLogHash,
  filters: ActivityLogType[]
): DatedActivityLogHash => {
  const filtered: DatedActivityLogHash = { general: [] };

  for (const [key, entries] of Object.entries(logs)) {
    filtered[key] = entries.filter(
      (entry) => filters.length === 0 || filters.includes(entry.type)
    );
  }

  return filtered;
};

/**
 * Turns activity log entries into timeline events.
 * General entries are collapsed to the newest event of each day.
 * @param logs - Dated activity logs grouped by key, including general
 * @param titleFor - Title for an entry
 * @param oppositeFor - Date label placed on the opposite side
 * @param stackedToday - Subtitle for the hidden events of that day
 * @returns Timeline events, newest first
 */
export const buildTimelineEvents = (
  logs: DatedActivityLogHash,
  titleFor: (entry: DatedActivityLogEntry) => string,
  oppositeFor: (entry: DatedActivityLogEntry) => string,
  stackedToday: (count: number) => string
): TimelineEvent[] => {
  const stackedTypes = new Set<ActivityLogType>([
    ActivityLogType.SessionLoggedin,
    ActivityLogType.ForumNewmessage,
  ]);

  const stackedByTypeAndDay = new Map<string, DatedActivityLogEntry[]>();

  for (const entry of [...logs.general].sort(byNewest)) {
    if (!stackedTypes.has(entry.type)) {
      continue;
    }

    const key = `${entry.type}|${dayKey(entry.timestamp)}`;
    const group = stackedByTypeAndDay.get(key);
    if (group) {
      group.push(entry);
    } else {
      stackedByTypeAndDay.set(key, [entry]);
    }
  }
  const otherGeneralEvents = logs.general.filter(
    (entry) =>
      entry.type !== ActivityLogType.SessionLoggedin &&
      entry.type !== ActivityLogType.ForumNewmessage
  );

  // General events are the newest event of each day
  // Other events are places as a count in the subtitle
  const stackedEvents = [...stackedByTypeAndDay.values()].map((group) => {
    const newest = group[0];
    const hiddenCount = group.length;
    return toEvent(
      newest,
      true,
      titleFor(newest),
      oppositeFor(newest),
      hiddenCount > 1 ? stackedToday(hiddenCount) : undefined
    );
  });

  const otherEvents = Object.entries(logs).flatMap(([key, entries]) => {
    if (key === "general") {
      return otherGeneralEvents.map((entry) =>
        toEvent(entry, true, titleFor(entry), oppositeFor(entry))
      );
    }

    return entries.map((entry) =>
      toEvent(entry, true, titleFor(entry), oppositeFor(entry))
    );
  });

  return [...stackedEvents, ...otherEvents].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
};

/**
 * Hook to get timeline events from user activity logs
 * @returns Timeline events, newest first
 */
const useTimelineEvents = () => {
  const activities = useAtomValue(userActivityLogsDataAtom);
  const { t } = useTranslation("activityLogs");
  const [filters, setFilters] = useState<ActivityLogType[]>([]);

  const filteredLogs = useMemo(() => {
    if (!activities) {
      return undefined;
    }
    return filterActivityLogs(activities, filters);
  }, [activities, filters]);

  const events = useMemo(() => {
    if (!filteredLogs) {
      return [];
    }

    return buildTimelineEvents(
      filteredLogs,
      (entry) => t(`types.${entry.type}`),
      (entry) =>
        localize.date(entry.timestamp, getTimelineTimeFormat(entry.timestamp)),
      (count) => t("labels.eventCount", { count })
    );
  }, [filteredLogs, t]);

  return {
    events,
    filters,
    setFilters,
  };
};

export default useTimelineEvents;
