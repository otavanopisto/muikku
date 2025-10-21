/**
 * Convert time range to minutes
 * @param start start
 * @param end end
 * @returns number
 */
export const convertTimeRangeToMinutes = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const timeRange = endDate.getTime() - startDate.getTime();

  const minutes = Math.round(timeRange / (1000 * 60));

  return minutes;
};
