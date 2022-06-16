import { SpecificActionType, AnyActionType } from "~/actions";
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
  null
>;

export type CLOSE_NOTIFICATION_DIALOG = SpecificActionType<
  "CLOSE_NOTIFICATION_DIALOG",
  null
>;

/**
 * DisplayNotificationTriggerType
 */
export interface DisplayNotificationTriggerType {
  (message: string, severity: NotificationSeverityType): AnyActionType;
}

/**
 * HideNotificationTriggerType
 */
export interface HideNotificationTriggerType {
  (notification: NotificationType): HIDE_NOTIFICATION;
}

/**
 * OpenNotificationDialogTrigger
 */
export interface OpenNotificationDialogTrigger {
  (): OPEN_NOTIFICATION_DIALOG;
}

/**
 * CloseNotificationDialogTrigger
 */
export interface CloseNotificationDialogTrigger {
  (): CLOSE_NOTIFICATION_DIALOG;
}

const DEFAULT_TIMEOUT = 5000;
const PERMANENT_LIST = ["warning", "fatal", "error", "notice"];

/**
 * displayNotification
 * @param message message
 * @param severity severity
 * @param timeout timeout
 */
const displayNotification: DisplayNotificationTriggerType =
  function displayNotification(message, severity, timeout?: number) {
    return async (dispatch: (arg: AnyActionType) => any) => {
      const notification: NotificationType = {
        id: new Date().getTime(),
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
    return {
      type: "HIDE_NOTIFICATION",
      payload: notification,
    };
  };

/**
 * openNotificationDialog
 */
const openNotificationDialog: OpenNotificationDialogTrigger =
  function hideNotificationType() {
    return {
      type: "OPEN_NOTIFICATION_DIALOG",
      payload: null,
    };
  };

/**
 * closeNotificationDialog
 */
const closeNotificationDialog: CloseNotificationDialogTrigger =
  function hideNotificationType() {
    return {
      type: "CLOSE_NOTIFICATION_DIALOG",
      payload: null,
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
