import { SpecificActionType, AppThunkAction } from "~/actions";
import {
  NotificationSeverityType,
  NotificationType,
} from "~/reducers/base/notifications";

export type ADD_NOTIFICATION = SpecificActionType<
  "ADD_NOTIFICATION",
  NotificationType
>;
export type HIDE_NOTIFICATION = SpecificActionType<
  "HIDE_NOTIFICATION",
  NotificationType
>;

export type OPEN_NOTIFICATION_DIALOG = SpecificActionType<
  "OPEN_NOTIFICATION_DIALOG",
  string
>;

export type CLOSE_NOTIFICATION_DIALOG = SpecificActionType<
  "CLOSE_NOTIFICATION_DIALOG",
  null
>;

/**
 * DisplayNotificationTriggerType
 */
export interface DisplayNotificationTriggerType {
  (
    message: string,
    severity: NotificationSeverityType,
    timeout?: number,
    customId?: string | number
  ): AppThunkAction;
}

/**
 * HideNotificationTriggerType
 */
export interface HideNotificationTriggerType {
  (notification: NotificationType): AppThunkAction;
}

/**
 * OpenNotificationDialogTrigger
 */
export interface OpenNotificationDialogTrigger {
  (message: string): AppThunkAction;
}

/**
 * CloseNotificationDialogTrigger
 */
export interface CloseNotificationDialogTrigger {
  (): AppThunkAction;
}

const DEFAULT_TIMEOUT = 5000;
const PERMANENT_LIST: NotificationSeverityType[] = [
  "warning",
  "fatal",
  "error",
  "notice",
  "persistent-info",
];

/**
 * displayNotification
 * @param message message
 * @param severity severity
 * @param timeout timeout
 * @param customId customId
 */
const displayNotification: DisplayNotificationTriggerType =
  function displayNotification(
    message,
    severity,
    timeout?: number,
    customId?: string | number
  ) {
    return async (dispatch) => {
      const notification: NotificationType = {
        id: customId || new Date().getTime(),
        severity: severity,
        message: message,
      };

      dispatch({
        type: "ADD_NOTIFICATION",
        payload: notification,
      });

      if (!PERMANENT_LIST.includes(severity) || timeout) {
        setTimeout(() => {
          dispatch({
            type: "HIDE_NOTIFICATION",
            payload: notification,
          });
        }, timeout || DEFAULT_TIMEOUT);
      }
    };
  };

/**
 * hideNotification
 * @param notification notification
 */
const hideNotification: HideNotificationTriggerType =
  function hideNotificationType(notification) {
    return (dispatch) => {
      dispatch({
        type: "HIDE_NOTIFICATION",
        payload: notification,
      });
    };
  };

/**
 * openNotificationDialog
 * @param message message
 */
const openNotificationDialog: OpenNotificationDialogTrigger =
  function openNotificationDialog(message) {
    return (dispatch) => {
      dispatch({
        type: "OPEN_NOTIFICATION_DIALOG",
        payload: message,
      });
    };
  };

/**
 * closeNotificationDialog
 */
const closeNotificationDialog: CloseNotificationDialogTrigger =
  function closeNotificationDialog() {
    return (dispatch) => {
      dispatch({
        type: "CLOSE_NOTIFICATION_DIALOG",
        payload: null,
      });
    };
  };

export default {
  displayNotification,
  hideNotification,
  openNotificationDialog,
  closeNotificationDialog,
};
export {
  displayNotification,
  hideNotification,
  openNotificationDialog,
  closeNotificationDialog,
};
