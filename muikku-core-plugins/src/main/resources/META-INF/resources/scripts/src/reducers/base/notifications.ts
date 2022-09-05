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
  id: number;
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
 * notifications
 * @param state state
 * @param action action
 */
export default function notifications(
  state: NotificationState = initialNotificationState,
  action: ActionType
) {
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

  /*   if (action.type === "ADD_NOTIFICATION") {
    const newNotification: NotificationType = action.payload;
    return state.concat(newNotification);
  } else if (action.type === "HIDE_NOTIFICATION") {
    return state.filter(
      (element: NotificationType) => element.id !== action.payload.id
    );
  } else if (action.type === "OPEN_NOTIFICATION_DIALOG") {
  } else if (action.type === "CLOSE_NOTIFICATION_DIALOG") {
  }
  return state; */
}
