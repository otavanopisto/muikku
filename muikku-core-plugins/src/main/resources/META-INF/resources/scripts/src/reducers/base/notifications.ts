import { ActionType } from "~/actions";
import { Reducer } from "redux";

export type NotificationSeverityType =
  | "error"
  | "warning"
  | "loading"
  | "default"
  | "notice"
  | "info"
  | "fatal"
  | "success"
  | "secondary"
  | "inverse";

/**
 * NotificationType
 */
export interface NotificationType {
  id: number;
  severity: NotificationSeverityType;
  message: string;
}

export type NotificationListType = Array<NotificationType>;

const initialNotificationState: NotificationListType = [];

/**
 * Reducer function for notifications
 *
 * @param state state
 * @param action action
 * @returns State of notifications
 */
export const notifications: Reducer<NotificationListType> = (
  state = initialNotificationState,
  action: ActionType
) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return state.concat(action.payload);

    case "HIDE_NOTIFICATION":
      return state.filter(
        (element: NotificationType) => element.id !== action.payload.id
      );

    default:
      return state;
  }
};

/**
 * notifications
 * @param state state
 * @param action action
 */
/* export default function notifications(
  state: NotificationListType = [],
  action: ActionType
) {
  if (action.type === "ADD_NOTIFICATION") {
    const newNotification: NotificationType = action.payload;
    return state.concat(newNotification);
  } else if (action.type === "HIDE_NOTIFICATION") {
    return state.filter(
      (element: NotificationType) => element.id !== action.payload.id
    );
  }
  return state;
} */
