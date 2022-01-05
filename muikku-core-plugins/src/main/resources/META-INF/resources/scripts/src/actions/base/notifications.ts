import { SpecificActionType, AnyActionType } from "~/actions";
import {
  NotificationSeverityType,
  NotificationType,
} from "~/reducers/base/notifications";
import { StateType } from "reducers";

export type ADD_NOTIFICATION = SpecificActionType<
  "ADD_NOTIFICATION",
  NotificationType
>;
export type HIDE_NOTIFICATION = SpecificActionType<
  "HIDE_NOTIFICATION",
  NotificationType
>;

export interface DisplayNotificationTriggerType {
  (message: string, severity: NotificationSeverityType): AnyActionType;
}

export interface HideNotificationTriggerType {
  (notification: NotificationType): HIDE_NOTIFICATION;
}

const DEFAULT_TIMEOUT = 5000;
const PERMANENT_LIST = ["warning", "fatal", "error", "notice"];

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

const hideNotification: HideNotificationTriggerType =
  function hideNotificationType(notification) {
    return {
      type: "HIDE_NOTIFICATION",
      payload: notification,
    };
  };

export default { displayNotification, hideNotification };
export { displayNotification, hideNotification };
