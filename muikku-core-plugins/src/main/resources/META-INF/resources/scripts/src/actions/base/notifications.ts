import {ADD_NOTIFICATION, HIDE_NOTIFICATION} from '~/actions';
import {NotificationSeverityType, NotificationType} from '~/reducers/index.d';

export default {
  displayNotification: function(message: string, severity: NotificationSeverityType):ADD_NOTIFICATION{
    return {
      'type': 'ADD_NOTIFICATION',
      'payload': {
        'id': (new Date()).getTime(),
        'severity': severity,
        'message': message
      }
    }
  },
  hideNotification: function(notification: NotificationType):HIDE_NOTIFICATION{
    return {
      'type': 'HIDE_NOTIFICATION',
      'payload': notification
    }
  }
};