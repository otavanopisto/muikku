import { ActionType } from "~/actions";

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

export interface NotificationType {
  id: number;
  severity: NotificationSeverityType;
  message: string;
}

export type NotificationListType = Array<NotificationType>;

export default function notifications(
  state: NotificationListType = [],
  action: ActionType,
) {
  if (action.type === "ADD_NOTIFICATION") {
    const newNotification: NotificationType = action.payload;
    return state.concat(newNotification);
  } else if (action.type === "HIDE_NOTIFICATION") {
    return state.filter(
      (element: NotificationType) => element.id !== action.payload.id,
    );
  }
  return state;
}
