import moment from "moment";

/**
 * Checks if note is expired or late
 * @param dueDate due date to check agains
 * @returns Whether note is expired or late
 */
export const isOverdue = (dueDate: string) =>
  dueDate !== null && moment(new Date()).isAfter(new Date(dueDate), "day");
