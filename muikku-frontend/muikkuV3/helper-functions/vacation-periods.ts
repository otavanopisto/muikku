import moment from "moment";

/**
 * VacationPeriod
 */
export interface VacationPeriod {
  start: Date | null;
  end: Date | null;
}

/**
 * Splits a comma-separated profile property into date fragments.
 * Empty fragments are kept so start/end indexes stay aligned.
 *
 * @param value value
 * @returns string fragments
 */
const splitProperty = (value?: string | null): string[] => {
  if (!value) {
    return [];
  }

  return value.split(",").map((part) => part.trim());
};

/**
 * Parses a date fragment into a Date, or null if it is empty/invalid.
 *
 * @param value value
 * @returns Date or null
 */
const toDate = (value?: string): Date | null => {
  if (!value) {
    return null;
  }

  const parsed = moment(value);

  return parsed.isValid() ? parsed.toDate() : null;
};

/**
 * Sorts periods by start date. Periods without a start stay last.
 *
 * @param periods periods
 * @returns sorted periods
 */
const sortVacationPeriods = (periods: VacationPeriod[]): VacationPeriod[] =>
  [...periods].sort((a, b) => {
    if (!a.start && !b.start) {
      return 0;
    }

    if (!a.start) {
      return 1;
    }

    if (!b.start) {
      return -1;
    }

    return a.start.getTime() - b.start.getTime();
  });

/**
 * Parses comma-separated vacation start/end profile properties into periods.
 * A single date without commas is treated as one period.
 *
 * @param startValue startValue
 * @param endValue endValue
 * @returns vacation periods
 */
export const parseVacationPeriods = (
  startValue?: string | null,
  endValue?: string | null
): VacationPeriod[] => {
  const starts = splitProperty(startValue);
  const ends = splitProperty(endValue);
  const length = Math.max(starts.length, ends.length);

  if (length === 0) {
    return [];
  }

  return sortVacationPeriods(
    Array.from({ length }, (_, index) => ({
      start: toDate(starts[index]),
      end: toDate(ends[index]),
    })).filter((period) => period.start || period.end)
  );
};

/**
 * Serializes vacation periods back into comma-separated profile properties.
 * Periods without a start are dropped. Missing end dates become empty
 * fragments so indexes stay aligned.
 *
 * @param periods periods
 * @returns serialized start and end strings
 */
export const serializeVacationPeriods = (
  periods: VacationPeriod[]
): { start: string | null; end: string | null } => {
  const toSave = sortVacationPeriods(
    periods.filter((period) => period.start && period.end)
  );

  if (toSave.length === 0) {
    return { start: null, end: null };
  }

  return {
    start: toSave.map((period) => period.start.toISOString()).join(","),
    end: toSave.map((period) => period.end.toISOString()).join(","),
  };
};

/**
 * Returns true when at least one period has both start and end dates.
 *
 * @param periods periods
 * @returns whether a complete period exists
 */
export const hasCompleteVacationPeriod = (periods: VacationPeriod[]): boolean =>
  periods.some((period) => period.start && period.end);

/**
 * Formats a vacation period for display. Same-day periods render as one date.
 *
 * @param period period
 * @param formatDate formatDate
 * @returns formatted date or date range
 */
export const formatVacationPeriodDates = (
  period: VacationPeriod,
  formatDate: (value: Date) => string
): string => {
  if (!period.start) {
    return "";
  }

  if (!period.end || moment(period.start).isSame(period.end, "day")) {
    return formatDate(period.start);
  }

  return `${formatDate(period.start)}–${formatDate(period.end)}`;
};

/**
 * Returns true when any two complete periods overlap, including sharing a day.
 *
 * @param periods periods
 * @returns whether periods overlap
 */
export const doVacationPeriodsOverlap = (
  periods: VacationPeriod[]
): boolean => {
  const ranges = periods
    .filter((period) => period.start && period.end)
    .map((period) => ({
      start: moment(period.start).startOf("day"),
      end: moment(period.end).startOf("day"),
    }))
    .sort((a, b) => a.start.valueOf() - b.start.valueOf());

  for (let i = 1; i < ranges.length; i++) {
    if (ranges[i].start.isSameOrBefore(ranges[i - 1].end, "day")) {
      return true;
    }
  }

  return false;
};

/**
 * Returns current and upcoming periods. Past-only periods are ignored.
 *
 * @param periods periods
 * @returns relevant periods
 */
export const getRelevantVacationPeriods = (
  periods: VacationPeriod[]
): VacationPeriod[] => {
  const today = moment().startOf("day");
  return sortVacationPeriods(
    periods.filter((period) => {
      if (!period.start || !period.end) {
        return false;
      }

      return (
        moment(period.end).isAfter(today, "day") ||
        moment(period.end).isSame(today, "day")
      );
    })
  );
};

/**
 * Picks the period to show on compact cards: currently ongoing, otherwise
 * the next upcoming one.
 *
 * @param periods periods
 * @returns display period or null
 */
export const getDisplayVacationPeriod = (
  periods: VacationPeriod[]
): VacationPeriod | null => {
  const today = moment().startOf("day");
  const relevant = getRelevantVacationPeriods(periods);
  const ongoing = relevant.find((period) => {
    const startsTodayOrEarlier = moment(period.start).isSameOrBefore(
      today,
      "day"
    );
    const endsTodayOrLater = moment(period.end).isSameOrAfter(today, "day");
    return startsTodayOrEarlier && endsTodayOrLater;
  });
  return ongoing || relevant[0] || null;
};

/**
 * Convenience wrapper for display consumers that still receive raw properties.
 *
 * @param startValue startValue
 * @param endValue endValue
 * @returns relevant periods
 */
export const getRelevantVacationPeriodsFromProperties = (
  startValue?: string | null,
  endValue?: string | null
): VacationPeriod[] =>
  getRelevantVacationPeriods(parseVacationPeriods(startValue, endValue));

/**
 * Convenience wrapper for compact cards that still receive raw properties.
 *
 * @param startValue startValue
 * @param endValue endValue
 * @returns display period or null
 */
export const getDisplayVacationPeriodFromProperties = (
  startValue?: string | null,
  endValue?: string | null
): VacationPeriod | null =>
  getDisplayVacationPeriod(parseVacationPeriods(startValue, endValue));
