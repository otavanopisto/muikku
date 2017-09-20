import {ADD_NOTIFICATION, HIDE_NOTIFICATION} from '~/actions';
import {NotificationSeverityType, NotificationType} from '~/reducers/index.d';

export interface displayNotificationType {
  (message: string, severity: NotificationSeverityType):ADD_NOTIFICATION
}

export interface hideNotificationType {
  (notification: NotificationType):HIDE_NOTIFICATION
}

let displayNotification:displayNotificationType = function displayNotification(message, severity){
  return {
    'type': 'ADD_NOTIFICATION',
    'payload': {
      'id': (new Date()).getTime(),
      'severity': severity,
      'message': message
    }
  }
}

let hideNotification:hideNotificationType = function hideNotificationType(notification){
  return {
    'type': 'HIDE_NOTIFICATION',
    'payload': notification
  }
}

export default {displayNotification, hideNotification};
export {displayNotification, hideNotification};