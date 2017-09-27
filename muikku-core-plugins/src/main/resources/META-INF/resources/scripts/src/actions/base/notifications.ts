import {SpecificActionType} from '~/actions';
import {NotificationSeverityType, NotificationType} from '~/reducers/base/notifications';

export interface ADD_NOTIFICATION extends SpecificActionType<"ADD_NOTIFICATION", NotificationType>{}
export interface HIDE_NOTIFICATION extends SpecificActionType<"HIDE_NOTIFICATION", NotificationType>{}

export interface DisplayNotificationTriggerType {
  (message: string, severity: NotificationSeverityType):ADD_NOTIFICATION
}

export interface HideNotificationTriggerType {
  (notification: NotificationType):HIDE_NOTIFICATION
}

let displayNotification:DisplayNotificationTriggerType = function displayNotification(message, severity){
  return {
    'type': 'ADD_NOTIFICATION',
    'payload': {
      'id': (new Date()).getTime(),
      'severity': severity,
      'message': message
    }
  }
}

let hideNotification:HideNotificationTriggerType = function hideNotificationType(notification){
  return {
    'type': 'HIDE_NOTIFICATION',
    'payload': notification
  }
}

export default {displayNotification, hideNotification};
export {displayNotification, hideNotification};