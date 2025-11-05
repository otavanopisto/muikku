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
  | "inverse"
  | "persistent-info";

/**
 * NotificationState
 */
export interface NotificationState {
  notifications: NotificationListType;
  notificationDialogOpen: boolean;
  dialogMessage: string;
}

/**
 * NotificationType
 */
export interface NotificationType {
  id: string | number;
  severity: NotificationSeverityType;
  message: string;
}

export type NotificationListType = Array<NotificationType>;

const initialNotificationState: NotificationState = {
  notifications: [],
  notificationDialogOpen: false,
  dialogMessage: "",
};

/**
 * Reducer function for notifications
 * @param state state
 * @param action action
 * @returns State of notifications
 */
export const notifications: Reducer<NotificationState> = (
  state: NotificationState = initialNotificationState,
  action: ActionType
) => {
  switch (action.type) {
    case "ADD_NOTIFICATION": {
      const newNotification: NotificationType = action.payload;
      return {
        ...state,
        notifications: state.notifications.concat(newNotification),
      };
    }

    case "HIDE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (element: NotificationType) => element.id !== action.payload.id
        ),
      };

    case "OPEN_NOTIFICATION_DIALOG":
      return {
        ...state,
        notificationDialogOpen: true,
        dialogMessage: action.payload,
      };

    case "CLOSE_NOTIFICATION_DIALOG":
      return {
        ...state,
        notificationDialogOpen: false,
      };

    default:
      return state;
  }
};
