import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { getActivitylogsApi } from "~/api";
import type { ActivityLogEntry, ActivityLogHash } from "~/generated/client";
import { localize } from "~/src/locales/i18n";
import { userAtom } from "./auth";

const activitylogsApi = getActivitylogsApi();

export type DatedActivityLogEntry = Omit<ActivityLogEntry, "timestamp"> & {
  timestamp: Date;
};

export type DatedActivityLogHash = {
  [key: string]: DatedActivityLogEntry[];
  general: DatedActivityLogEntry[];
};

const isActivityLogEntry = (value: unknown): value is ActivityLogEntry =>
  typeof value === "object" &&
  value !== null &&
  "type" in value &&
  "timestamp" in value &&
  "contextId" in value;

const toDatedEntry = (entry: ActivityLogEntry): DatedActivityLogEntry => ({
  type: entry.type,
  contextId: entry.contextId,
  timestamp: new Date(entry.timestamp),
});

const withDateTimestamps = (logs: ActivityLogHash): DatedActivityLogHash => {
  const dated: DatedActivityLogHash = { general: [] };

  for (const [key, value] of Object.entries(logs)) {
    if (!Array.isArray(value)) {
      continue;
    }
    dated[key] = value.filter(isActivityLogEntry).map(toDatedEntry);
  }

  return dated;
};

const currentWeekRange = () => {
  const today = localize.getLocalizedDayjs();
  return {
    from: today.startOf("week").toDate(),
    to: today.endOf("week").toDate(),
  };
};

export const userActivityLogsQueryAtom = atomWithQuery((get) => {
  const userIdentifier = get(userAtom)?.identifier;
  const { from, to } = currentWeekRange();
  return {
    queryKey: [
      "userActivityLogs",
      userIdentifier,
      from.toISOString(),
      to.toISOString(),
    ],
    queryFn: async () => {
      if (!userIdentifier) {
        throw new Error("User ID is required");
      }

      const result = await activitylogsApi.getUserActivityLogs({
        userIdentifier,
        from,
        to,
      });

      return withDateTimestamps(result);
    },
  };
});

export const userActivityLogsDataAtom = atom(
  (get) => get(userActivityLogsQueryAtom).data
);
